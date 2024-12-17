import * as express from "express";
import Database from "../../../../database";
import {CloudinaryApi} from "./cloudinary.api";
import {Post} from "../../../../interfaces";
import { authenticateToken } from "../../../user-authentification";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import {GPSDataExtractor} from "./gps.data.extractor";
import {BaseDatabaseController} from "../../base.database.controller";
import {boolean} from "yup";

const upload = multer({
    dest: path.join(__dirname, "uploads"), // Temporary storage
})

export class StorePostInformationController extends BaseDatabaseController {

    imageApi = new CloudinaryApi();

    constructor(private db: Database) {
        super();
    }

    initializeRoutes(): void {

        this.router.post("/store/post", authenticateToken, upload.single("file"),(req: express.Request, response: express.Response) => {
            return this.addPost(req, response);
        });
    }

    private async addPost(req: express.Request, res: express.Response) {
        // @ts-ignore
        const file = req.file
        try {
            // @ts-ignore
            const userId = req.user.user_id;
            if (!file || !req.body.caption) {
                return res.status(400).send("Missing required fields: 'file' or 'caption'");
            }
            if (!userId){
                return res.status(400).send("Not authenticated");
            }

            const filePath = file.path; // Path to the uploaded file
            const caption = req.body.caption;
            const bodyTags = req.body.tags;
            const is_public: boolean = (req.body.public === "true");

            const location = {
                latitude: req.body.latitude || null,
                longitude: req.body.longitude || null,
            };
            console.log(location)
            const geoData = await GPSDataExtractor(filePath, location);

            const imageUrl = await this.imageApi.postImage(filePath);
            let [tags, evaluation] = await Promise.all([
                this.imageApi.identifyImage(imageUrl),
                this.imageApi.appraiseImage(imageUrl),
            ]);

            if (tags.length === 0) {
                tags = [bodyTags];
            }

            const post: Post = {
                user: "null",
                post_id: 0,
                description: caption,
                image_url: [imageUrl],
                user_id: userId,
                location: geoData || null,
                public: is_public || true,
                tags: tags || [],
                score: evaluation[0],
                rarity: evaluation[1],
            };

            const xp = evaluation[0] * evaluation[1];
            await this.db.addUserExp(userId, xp);
            await this.db.storePost(post);

            return res.status(200).json(post);
        } catch (error) {
            console.error("Error processing post:", error);

            return res.status(500).json({ error: "Something went wrong", details: error.message || error });
        } finally {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    }
}

