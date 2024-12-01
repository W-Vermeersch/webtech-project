import {BaseController} from "../base.controller";
import * as express from "express";
import Database from "../../database";
import {CloudinaryApi} from "./cloudinary.api";
import {Post} from "../../../Global/post";
import * as ExifReader from 'exifreader';
import {authenticateToken} from "../user-authentification/login.controllers";


export class PostController extends BaseController {

    imageApi = new CloudinaryApi();

    constructor(private db: Database) {
        super("/post");
    }

    initializeRoutes(): void {

        this.router.post("/add", authenticateToken,(req: express.Request, response: express.Response) => {
            return this.addPost(req, response);
        });

        this.router.get("/get", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getPost(req, response);
        });
    }

    private async addPost(req: express.Request, res: express.Response) {
        const post = new Post(req.body);
        if (post.image_url){
             await this.imageApi.postImage(req.body.filename).then((resp) => {
                post.image_url = resp
                 // TODO: extract longitude and latitude from image
                // this.db.storePost(post)
                 return res.status(200);
            }).catch((err: Error) => {
                return res.status(500).send("Something went wrong");
             })
        } else {return res.status(404).send("No image found");}
    }

    private getPost(req: express.Request, res: express.Response) {
        return res
    }
}