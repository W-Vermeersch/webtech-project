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
import * as mime from "mime";
// import {fileTypeFromBuffer} from "file-type"
// const fileType = require("file-type");


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

        this.router.post("/add", (req: express.Request, response: express.Response) => {
            return this.addPost(req, response);
        });

        this.router.get("/get", (req: express.Request, response: express.Response) => {
            return this.getPost(req, response);
        });
    }

    private async addPost(req: express.Request, res: express.Response) {
        try {
            const body = req.body;

            if (!body || !body.file || !body.caption) {
                return res.status(400).send("Missing required fields: 'image' or 'filename'");
            }

            console.log("Post post/add request:", body);

            // let base64Data = body.file.split(",")[1];




            // Decode the base64 string
            const base64Data = body.file.split(";base64,").pop();


            if (!base64Data) {
                return res.status(400).send("Invalid base64 image format");
            }
            // const binaryData = Buffer.from(base64Data, "base64");
            // let ext = ""
            // mime.extension(binaryData).then((fileInfo) => {
            //     if (fileInfo) {
            //         ext = fileInfo.ext
            //         console.log(`File format: ${fileInfo.ext}`);
            //         console.log(`MIME type: ${fileInfo.mime}`);
            //     } else {
            //         console.log("File type could not be determined.");
            //     }
            // });

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

            console.log(mime.extension(tempFilePath))

            // Optionally extract longitude and latitude
            // const { longitude, latitude } = extractGeoData(tempFilePath);
            // post.location = { longitude, latitude };

            // Process the image via the image API
            if (false){
                const imageUrl = await this.imageApi.postImage(tempFilePath);
            }

            // Clean up the temporary file
            // fs.unlinkSync(tempFilePath);

            // Create a new post object
            const post = new Post(body);

            // post.image_url = imageUrl;



            // Store the post in the database
            // await this.db.storePost(post);

            return res.status(200).send(post);
        } catch (error) {
            console.error("Error processing post:", error);
            return res.status(500).send("Something went wrong");
        }
    }


    //     return this.upload.single("file"), async (req: express.Request, res: express.Response) => {
    //         try {
    //             // @ts-ignore
    //             const { body, file } = req;
    //             console.log("Form data received:", body);
    //
    //             if (!file) {
    //                 return res.status(400).send("No file uploaded");
    //             }
    //
    //
    //             console.log("File details:", file);
    //
    //             console.log("Post post/add request:", body);
    //             if (!file) {
    //                 return res.status(301).send("No image found");
    //             }
    //             // console.log("Post post/add request:", body);
    //             // Post creation logic
    //             const post = new Post(body);
    //             const imageFilePath = file.path;
    //
    //             // Optionally extract longitude and latitude here
    //             // const { longitude, latitude } = extractGeoData(imageFilePath);
    //             // post.location = { longitude, latitude };
    //
    //             // Pass the image to image API
    //             const imageUrl = await this.imageApi.postImage(imageFilePath);
    //             post.image_url = imageUrl;
    //
    //             // Store post in the database
    //             // await this.db.storePost(post);
    //
    //             // TODO: extract longitude and latitude from image
    //             // this.db.storePost(post)
    //             return res.status(200);
    //
    //             // return res.status(200).send(post);
    //         } catch (error) {
    //             console.error("Error processing post:", error);
    //             return res.status(500).send("Something went wrong");
    //         }
    //     };
    // }

    private getPost(req: express.Request, res: express.Response) {
        console.log("Get post/get request: " +req.body);
        return res
    }
}