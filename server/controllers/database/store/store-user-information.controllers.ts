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

        this.router.post("/store/user/follow-user", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.followUser(req, response);
        });

        this.router.post("/store/user/update-bio", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.updateBio(req, response);
        });

        this.router.post("/store/user/update-profile-picture", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.updatePFP(req, response);
        });

        this.router.post("/store/user/update-displayname", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.updateDisplayname(req, response);
        });
    }

    private async likePost(req, res) {
        const username = req.user.username
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
    private async updateBio(req, res) {
        const newBio = req.query.new_bio
        const username = req.user.username
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
    private async updatePFP(req, res) {
        const newPFP = req.query.new_profile_picture
        const username = req.user.username
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
    private async updateDisplayname(req, res) {
        const newName = req.query.new_display_name
        const username = req.user.username
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