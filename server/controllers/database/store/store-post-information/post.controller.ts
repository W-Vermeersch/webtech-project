import * as express from "express";
import Database from "../../../../database";
import {CloudinaryApi} from "./cloudinary.api";
import {Post} from "../../../../interfaces";
import * as ExifReader from 'exifreader';
import { authenticateToken } from "../../../user-authentification";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import {GPSDataExtractor} from "./gps.data.extractor";
import {BaseDatabaseController} from "../../base.database.controller";

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
            // Ensure the file exists
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

            // Optionally extract geo-data
            const geoData = await GPSDataExtractor(filePath);

            // Process image via API
            const imageUrl = await this.imageApi.postImage(filePath);
            const [tags, evaluation] = await Promise.all([
                this.imageApi.identifyImage(imageUrl),
                this.imageApi.appraiseImage(imageUrl),
            ]);

            // Construct post
            const post: Post = {
                user: "null",
                post_id: 0,
                description: caption,
                image_url: [imageUrl],
                user_id: userId,
                location: geoData || null,
                tags: tags || [],
                score: evaluation[0],
                rarity: evaluation[1],
            };

            // Add rewards and store post
            const xp = evaluation[0] * evaluation[1];
            await this.db.addUserExp(userId, xp);
            await this.db.storePost(post);

            // Cleanup uploaded file
            fs.unlinkSync(filePath);

            return res.status(200).json(post);
        } catch (error) {
            console.error("Error processing post:", error);

            // Ensure file cleanup
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return res.status(500).json({ error: "Something went wrong", details: error.message || error });
        }
    }
}

