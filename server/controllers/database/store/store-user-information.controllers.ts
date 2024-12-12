import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";

export class StoreUserInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {

        this.router.get("/store/user/like-post", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.likePost(req, response);
        });

        this.router.get("/store/user/follow-user", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.followUser(req, response);
        });

        this.router.get("/store/user/update-bio", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.updateBio(req, response);
        });

        this.router.get("/store/user/update-profile-picture", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.updatePFP(req, response);
        });

        this.router.get("/store/user/update-displayname", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.updateDisplayname(req, response);
        });
    }

    private async likePost(req: express.Request, res: express.Response) {
        const username = req.query.username
        const post_id = parseInt(req.query.post_id.toString());

        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/home'
            });
        } else {
            const userObject = users[0]
            const user_id = userObject.user_id

            let likedPostsOfUser = await this.db.fetchLikedPostsOfUser(user_id)
            likedPostsOfUser = likedPostsOfUser.map((post: any) => post.post_id)
            if (!likedPostsOfUser.includes(post_id)) {
                await this.db.storeLike(user_id, post_id)
                res.status(200).send("Successfully liked post")
            } else {
                res.status(404).send("User has already liked this post")
            }
        }
    }
    private async followUser(req: express.Request, res: express.Response) {
        console.log("TO DO");
    }
    private async updateBio(req: express.Request, res: express.Response) {
        const newBio = req.params.new_bio
        const username = req.query.username
        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/home'
            });
        } else {
            const userObject = users[0]
            const user_id = userObject.user_id

            await this.db.updateBio(user_id, newBio.toString())
        }
    }
    private async updatePFP(req: express.Request, res: express.Response) {
        const newPFP = req.params.new_profile_picture
        const username = req.query.username
        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/home'
            });
        } else {
            const userObject = users[0]
            const user_id = userObject.user_id

            await this.db.updateProfilePicture(user_id, newPFP.toString())
        }
    }
    private async updateDisplayname(req: express.Request, res: express.Response) {
        const newName = req.params.new_display_name
        const username = req.query.username
        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.json({
                redirect: '/home'
            });
        } else {
            const userObject = users[0]
            const user_id = userObject.user_id

            await this.db.updateDisplayName(user_id, newName.toString())
        }
    }


}