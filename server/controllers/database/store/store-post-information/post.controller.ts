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



export class StorePostInformationController extends BaseDatabaseController {

    imageApi = new CloudinaryApi();

    private upload = multer({
        dest: path.join(__dirname, "uploads"), // Temporary storage
        limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    });

    constructor(private db: Database) {
        super();
    }

    initializeRoutes(): void {

        this.router.post("/store/post", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.addPost(req, response);
        });
    }

    private async addPost(req: express.Request, res: express.Response) {
        try {
            const body = req.body;

            if (!body || !body.file || !body.caption) {
                return res.status(400).send("Missing required fields: 'image' or 'filename'");
            }

            // Decode the base64 string
            const base64Data = body.file.split(";base64,").pop();

            if (!base64Data) {
                return res.status(400).send("Invalid base64 image format");
            }

            // Save the image to a temporary file
            const tempDir = path.join(__dirname, "uploads");
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            let extension = "";
            if (body.image_type){
                extension = "." + body.image_type.split('/').pop();
            } else extension = ".jpg";
            const tempFilePath = path.join(tempDir, `${body.caption}${extension}`);
            fs.writeFileSync(tempFilePath, base64Data, { encoding: "base64" });

            // Optionally extract longitude and latitude
            const GeoData = GPSDataExtractor(tempFilePath);


            console.log("process image")
            // Process the image via the image API
            await this.imageApi.postImage(tempFilePath).then(async (imageUrl) => {
                const tags = this.imageApi.identifyImage(imageUrl);
                const evaluation = this.imageApi.appraiseImage(imageUrl);
                const post: Post = body;
                post.description = body.caption;
                post.image_url = [imageUrl];

                // @ts-ignore
                const userID = req.user.user_id;
                post.user = userID;

                post.location = await GeoData;
                if ((await tags).length !== 0) {
                    post.tags = await tags;
                }

                // Store the post in the database

                console.log(post);
                const reward: number[] = await evaluation
                post.score = reward[0]
                post.rarity = reward[1]
                console.log("Evaluation of the post: ", reward)
                const xp = reward[0]*reward[1]
                await this.db.addUserExp(userID, xp);
                await this.db.storePost(post);

                fs.unlinkSync(tempFilePath);
                return res.status(200).send(post);
                }
            ).catch((error) => {
                fs.unlinkSync(tempFilePath);
                console.error("Error processing post:", error);
                return res.status(500).send("Something went wrong");
            });

        } catch (error) {
            console.error("Error processing post:", error);
            return res.status(500).send("Something went wrong");
        }
    }
}

