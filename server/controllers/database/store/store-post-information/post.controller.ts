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
import {randomInt} from "node:crypto";

const upload = multer({
    dest: path.join(__dirname, "uploads"),
})

const TEN_MB = 10 * 1024 * 1024;

export class StorePostInformationController extends BaseDatabaseController {

    imageApi = new CloudinaryApi();
    useAiDetection = false;

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
            const errors = []
            // @ts-ignore
            const userId = req.user.user_id;
            if (!file){
                errors.push('file')
            }
            if (!file || !req.body.caption) {
                errors.push('caption')
            }
            if (!req.body.tags || req.body.tags === ''){
                errors.push('tags')
            }
            if (errors.length > 0){
                return res.status(400).send(`Missing required fields: ${errors.toString()}`);
            }
            const filePath = file.path;
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error reading file stats:', err);
                }
                console.log(stats.size);
                if (stats.size > TEN_MB){

                    return res.status(400).send("The given picture is to big");
                }
            });
            if (!userId){
                return res.status(400).send("Not authenticated");
            }

            const caption = req.body.caption;
            let tags = req.body.tags.split(',');
            const is_public: boolean = (req.body.public === "true");

            const location = {
                latitude: req.body.latitude || null,
                longitude: req.body.longitude || null,
            };
            const geoData = await GPSDataExtractor(filePath, location);
            const imageUrl = await this.imageApi.postImage(filePath);
            let rating = {
                score: randomInt(100),
                rarity: 1.0
            }

            if (this.useAiDetection){
                tags = await this.imageApi.identifyImage(imageUrl)
                if (tags.length === 0) {
                    return res.status(405).send("Unable to identify the animal in the picture!");
                }
                rating = await this.imageApi.appraiseImage(imageUrl)
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
                score: rating.score,
                rarity: rating.rarity,
            };

            const xp = rating.score * rating.rarity;
            await this.db.addUserExp(userId, xp);
            await this.db.storePost(post);

            return res.status(200).json(post);
        } catch (error) {
            console.error("Error processing post:", error);
            return res.status(500).send(error);

            // return res.status(500).json({ error: "Something went wrong", details: error.message || error });
        } finally {
            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
    }
}

