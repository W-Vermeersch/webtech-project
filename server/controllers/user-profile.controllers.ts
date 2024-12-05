import * as express from "express";
import { authenticateToken } from "./user-authentification/login.controllers";
import { UserAuthentificationController } from "./user-authentification/base.user.controller";

export class userProfileController extends UserAuthentificationController {

    constructor() {
        super();
    }

    initializeRoutes(): void {
        this.router.get("/user-profile", authenticateToken, (req: express.Request, response: express.Response) => {
           console.log("authenticated")
           return response.status(204).send("Succesfully authenticated the user");
        }
    )}
}