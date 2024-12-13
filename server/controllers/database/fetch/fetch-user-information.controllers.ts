import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";

export class FetchUserInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {
        // /user/get
        this.router.get("/fetch/user/profile", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getProfileInformation(req, response);
        });

        this.router.get("/fetch/user/comments", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getUserComments(req, response);
        });

        this.router.get("/fetch/user/posts", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getUserPosts(req, response);
        });

        this.router.get("/fetch/user/liked-posts", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getUserLikedPosts(req, response);
        });
    }

    // All fetching operations require the username inside the request parameters.

    private async getProfileInformation(req: express.Request, res: express.Response) {
        const username = (req.query.username) ? req.query.username : " ";

        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/home'
            });
        } else {
            const userObject = users[0]
            const userProfileDecoration = await this.db.fetchProfileDecoration(userObject.user_id);
            //console.log("user prifile decoration: "+ userProfileDecoration);
            //console.log(userProfileDecoration[0].display_name)
            res.json({
                username: userObject.username,
                user_id: userObject.user_id,
                displayname: userProfileDecoration[0].display_name,
                profilepicture: userProfileDecoration[0].profile_picture_image_url,
                bio: userProfileDecoration[0].bio,
                totalexp: userProfileDecoration[0].total_exp,
                badges: userProfileDecoration[0].badges
            });
        }
    }

    private async getUserComments(req: express.Request, res: express.Response) {
        const username = (req.query.username) ? req.query.username : " ";
        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const userObject = users[0]
            const userComments = (await this.db.fetchCommentsOfUser(userObject.user_id))
            res.json({
                user_comments: userComments
            });
        }
    }

    private async getUserPosts(req: express.Request, res: express.Response) {
        const username = (req.query.username) ? req.query.username : " ";
        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const userObject = users[0]
            const userPosts = (await this.db.fetchPostsOfUser(userObject.user_id))
            console.log(userPosts)
            res.json({
                user_posts: userPosts
            });
        }
    }

    private async getUserLikedPosts(req: express.Request, res: express.Response) {
        const username = (req.query.username) ? req.query.username : " ";
        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const userObject = users[0]
            const likedPosts = (await this.db.fetchLikedPostsOfUser(userObject.username))
            res.json({
                user_liked_posts: likedPosts
            });
        }
    }

}
