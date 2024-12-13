import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";

export class FetchPostInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {

        this.router.get("/fetch/post/information", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getPostInformation(req, response);
        });

        this.router.get("/fetch/post/comments", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getPostComments(req, response);
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

        const post = await this.db.fetchPostsByIds([post_id])
        if (post.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const postObject = post[0]
            const postOwner = this.db.fetchUserUsingID(postObject.user_id);
            res.json({
                username: postOwner,
                user_id: postObject.user_id,
                image_urls: postObject.image_url,
                description: postObject.description,
                tags: postObject.tags,
                location: postObject.location //can be null, not all posts have locations
            });
        }
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
            const postComments = (await this.db.fetchCommentsOfPost(postObject.post_id))
            res.json({
                post_comments: postComments
            });
        }
    }

}

