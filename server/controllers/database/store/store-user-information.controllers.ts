import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";
import {Post} from "../../../interfaces";
import * as multer from "multer";
import {CloudinaryApi} from "./store-post-information/cloudinary.api";
import * as path from "path";
import * as fs from "fs";

const upload = multer({
    dest: path.join(__dirname, "uploads"), // Temporary storage
})

export class StoreUserInformationController extends BaseDatabaseController {

    imageApi = new CloudinaryApi();

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {

        this.router.get("/store/user/like-post", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.likePost(req, response);
        });

        this.router.post("/store/user/follow", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.followUser(req, response);
        });

        this.router.post("/store/user/update-bio", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.updateBio(req, response);
        });

        this.router.post("/store/user/update-profile-picture", authenticateToken, upload.single("file"), (req: express.Request, response: express.Response) => {
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

            let likedPostsOfUser: number[] = (await this.db.fetchLikedPostsOfUser(user_id))
                .map((post: Post) => {
                return post.post_id
            })
            if (!likedPostsOfUser.includes(post_id)) {
                await this.db.storeLike(user_id, post_id)
                res.status(200).send("Successfully liked post")
            } else {
                res.status(404).send("User has already liked this post")
            }
        }
    }
    private async followUser(req, res) {
        const username = req.user.username
        const usernameToFollow = req.query.username;
        const userIdToFollow = (await this.db.fetchUserUsingUsername(usernameToFollow))[0].user_id

        const users = await this.db.fetchUserUsingUsername(username.toString())
        if (users.length === 0) {
            res.status(404).send("username not found in database")
        } else {
            const userObject = users[0]
            const user_id = userObject.user_id

            let userFollowed: number[] = (await this.db.fetchUserFollowed(user_id))
    
            if (!userFollowed.includes(userIdToFollow)) {
                await this.db.followUser(user_id, userIdToFollow)
                res.status(200).send("Successfully followed user")
            } else {
                res.status(404).send("User has already followed this user")
            }
        }
    }

    private async updateBio(req, res) {
        const newBio = req.body.new_bio
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
            res.status(200).send("Successfully updated bio")
            
        }
    }
    private async updatePFP(req, res) {
        // @ts-ignore
        const file = req.file
        let file_url = req.body.file_url
        console.log(file_url)
        try {
            console.log("Upload file")
            if (!file && !file_url) {
                return res.status(400).send("Missing required fields: 'file' or 'caption'");
            }
            if (!file_url){
                file_url = await this.imageApi.postImage(file.path);
            } else {
                file_url = file_url.toString();
            }
            const username = req.user.username
            const users = await this.db.fetchUserUsingUsername(username.toString())
            if (users.length === 0) {
                res.json({
                    redirect: '/home'
                });
            } else {
                const userObject = users[0]
                const user_id = userObject.user_id

                await this.db.updateProfilePicture(user_id, file_url)
                res.status(200).send("Successfully updated profile picture")
            }
        } catch (error) {
            console.error("Error processing post:", error);

            if (file?.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return res.status(500).json({ error: "Something went wrong", details: error.message || error });
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