import * as express from "express";
import { authenticateToken } from "./user-authentification/login.controllers";
import { UserAuthentificationController } from "./user-authentification/base.user.controller";
import Database from "../database";

export class UserInfoController extends UserAuthentificationController {

    constructor(private db: Database) {
        super();
    }

    initializeRoutes(): void {
        // /user/get 
        this.router.get("/get-profile-information", authenticateToken, (req: express.Request, response: express.Response) => {
           console.log("authenticated")
           return this.getUserInformation(req, response);
        });

        this.router.get("/get-user-posts", authenticateToken, (req: express.Request, response: express.Response) => {
            console.log("authenticated")
            return this.getUserInformation(req, response);
        });

        this.router.get("/get-user-liked-posts", authenticateToken, (req: express.Request, response: express.Response) => {
            console.log("authenticated")
            return this.getUserInformation(req, response);
        });

         this.router.get("/get-user-comments", authenticateToken, (req: express.Request, response: express.Response) => {
            console.log("authenticated")
            return this.getUserInformation(req, response);
        });
    }


    private async getUserInformation(req: express.Request, res: express.Response) {
        const username = (req.query.username ) ? req.query.username : " ";

        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const userObject = users[0]
            const userProfileDecoration = (await this.db.fetchProfileDecoration(userObject.user_id))[0]
            res.json({
                username: userObject.username,
                user_id: userObject.user_id,
                displayname: userProfileDecoration.display_name,
                profilepicture: userProfileDecoration.profile_picture_image_url,
                bio: userProfileDecoration.bio,
                totalexp: userProfileDecoration.total_exp,
                badges: userProfileDecoration.badges
            });
        }
        res.json
        console.log("Get post/get request: " +req.query.username);
        return res
    }
}