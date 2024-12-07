import {BaseController} from "../base.controller";
import * as express from "express";
import Database from "../../database";
import {CloudinaryApi} from "./cloudinary.api";
import {Post} from "../../../Global/post";
import * as ExifReader from 'exifreader';
import { authenticateToken } from "../user-authentification/login.controllers";
import * as multer from "multer";
import path = require("path");
import * as fs from "fs";
import {GPSDataExtractor} from "./gps.data.extractor";



export class PostController extends BaseController {

    imageApi = new CloudinaryApi();

    private upload = multer({
        dest: path.join(__dirname, "uploads"), // Temporary storage
        limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    });

    constructor(private db: Database) {
        super("/post");
    }

    initializeRoutes(): void {

        this.router.post("/add", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.addPost(req, response);
        });

        this.router.get("/get", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getPost(req, response);
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
            const { longitude, latitude } = await GPSDataExtractor(tempFilePath);


            // Process the image via the image API
            await this.imageApi.postImage(tempFilePath).then(async (imageUrl) => {
                    const post = new Post(body);
                    post.title = body.caption;
                    post.longitude = longitude;
                    post.latitude = latitude;
                    post.image_url = imageUrl;
                    fs.unlinkSync(tempFilePath);

                    // @ts-ignore
                    const userID = await this.db.fetchUserUsingUsername(req.user);
                    console.log(userID);
                    post.user = userID;

                    // Store the post in the database
                    // await this.db.storePost(post);
                    console.log(post);

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

    private getPost(req: express.Request, res: express.Response) {
        console.log("Get post/get request: " +req.body);
        return res
    }
}