import * as express from "express";
import { authenticateToken } from "./user-authentification";
import {BaseController} from "./base.controller";

export class UserProfileController extends BaseController {

    constructor() {
        super("/user");
    }

    initializeRoutes(): void {
        this.router.get("/user-profile", authenticateToken, (req: express.Request, response: express.Response) => {
           // console.log("authenticated")
           return response.status(204).send("Succesfully authenticated the user");
        }
    )}
}