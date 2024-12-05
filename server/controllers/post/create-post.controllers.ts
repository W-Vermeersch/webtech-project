import {BaseController} from "../base.controller";
import * as express from "express";
import { authenticateToken } from "../user-authentification/login.controllers";

export class CreatePostController extends BaseController {


    constructor() {
        super("/post");
    }

    initializeRoutes(): void {
        this.router.post("/create-post", authenticateToken, (req: express.Request, response: express.Response) => {
           console.log("authenticated")
           return response.status(204).send("Succesfully authenticated the user");

        }
    )}
}