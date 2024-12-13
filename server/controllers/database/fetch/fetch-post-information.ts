import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";

export class FetchPostInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {

        this.router.get("/fetch/post/information", (req: express.Request, response: express.Response) => {
            return this.getPostInformation(req, response);
        });

        this.router.get("/fetch/post/random-posts", (req: express.Request, response: express.Response) => {
            return this.getRandomPosts(req, response);
        });

        this.router.get("/fetch/post/comments", (req: express.Request, response: express.Response) => {
            return this.getPostComments(req, response);
        });

        this.router.get("/fetch/post/like-amount", (req: express.Request, response: express.Response) => {
            return this.getPostLikesAmount(req, response);
        });

    }

    private async getPostInformation(req: express.Request, res: express.Response) {
        if (!req.query.post_id) {
            res.json({
                redirect: '/pageNotFound'
            });
            return;
        }
        const post_id = parseInt(req.query.post_id.toString());
        const posts = await this.db.fetchPostsByIds([post_id])
        if (posts.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const postObject = posts[0]
            const postOwner = await this.db.fetchUserUsingID(postObject.user_id)
            const postOwnerDecoration = await this.db.fetchProfileDecoration(postObject.user_id);
            res.json({
                user: postOwner[0].username,
                profile_picture: postOwnerDecoration[0].profile_picture_image_url,
                image_url: postObject.image_url,
                description: postObject.description,
                tags: postObject.tags,
                location: postObject.location
                });
        }
    }

    private async getRandomPosts(req: express.Request, res: express.Response) {
        const shownIds = req.cookies.shown_post_ids
        console.log("getRandomPosts called")
        const post_count = parseInt(req.query.nr_of_posts.toString());
        const postIds = await this.db.fetchRandomPosts(post_count, shownIds) 
        console.log("postIds: "+ postIds)
        const posts: {
            user: String, 
            profile_picture: String[],
            image_url: String[],
            description: String,
            tags: String[],
            location: {
                latitude: Number,
                Longitude: Number
            }
        }[]= []

        const postPromises = postIds.map(async (post_id) => {
            console.log(post_id)
            const post_list = await this.db.fetchPostsByIds([post_id])
            const postObject = post_list[0]
            const postOwner = await this.db.fetchUserUsingID(postObject.user_id)
            const postOwnerDecoration = await this.db.fetchProfileDecoration(postObject.user_id);
            const postToSend = {
                user: postOwner[0].username,
                profile_picture: postOwnerDecoration[0].profile_picture_image_url,
                image_url: postObject.image_url,
                description: postObject.description,
                tags: postObject.tags,
                location: postObject.location
                }
            posts.push(postToSend);
            shownIds.push(post_id);
       })
        await Promise.all(postPromises);
        res.cookie("shown_post_ids", shownIds)
        res.json({
            posts: posts,
        });
    }

    private async getPostComments(req: express.Request, res: express.Response) {
        if (!req.query.post_id) {
            res.json({
                redirect: '/pageNotFound'
            });
            return;
        }
        const post_id = parseInt(req.query.post_id.toString());

        const posts = await this.db.fetchPostsByIds([post_id])
        if (posts.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const postObject = posts[0]
            const postComments = await this.db.fetchCommentsOfPost(postObject.post_id)
            res.json({
                post_comments: postComments
            });
        }
    }

    private async getPostLikesAmount(req: express.Request, res: express.Response) {
        if (!req.query.post_id) {
            res.json({
                redirect: '/pageNotFound'
            });
            return;
        }
        const post_id = parseInt(req.query.post_id.toString());
        const user_ids = await this.db.fetchLikedUsersOfPost(post_id)
    
        res.json({
            nr_of_likes: user_ids.length
            });
        }
    }



