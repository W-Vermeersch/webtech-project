import * as express from "express";
import { authenticateToken } from "./user-authentification";
import {BaseController} from "./base.controller";

export class UserProfileController extends BaseController {

    constructor() {
        super("/user");
    }
    /*
    Ensures that when the user clicks on a profile, it will only direct them to the profile if they are logged in.
    */
    initializeRoutes(): void {
        this.router.get("/user-profile", authenticateToken, (req: express.Request, response: express.Response) => {
           return response.status(204).send("Succesfully authenticated the user");
        }
    )}
}