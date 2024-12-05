import {BaseController} from "../base.controller";
import * as express from "express";
import { authenticateToken } from "../user-authentification/login.controllers";

export class createPostController extends BaseController {


    constructor() {
        super("/post");
    }

    initializeRoutes(): void {
        this.router.post("/create-post", authenticateToken, (req: express.Request, response: express.Response) => {
           console.log("authenticated, redirect to create post page.")
           return response.status(204).send("Succesfully authenticated the user");

        }
    )}
}