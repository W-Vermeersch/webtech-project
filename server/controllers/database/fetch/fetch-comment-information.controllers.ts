import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";

export class FetchCommentInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {
        this.router.get("/fetch/comment/information", (req: express.Request, response: express.Response) => {
            return this.getCommentInformation(req, response);
        });
    }

    private async getCommentInformation(req: express.Request, res: express.Response) {
        try {
            const comment_id = req.query.comment_id ? parseInt(req.query.comment_id.toString()) : null;
            if (comment_id === null) {
                res.status(400).json({ error: "Invalid comment_id" });
                return;
            }
            const comments = await this.db.fetchCommentByIds([comment_id]);
            if (comments.length === 0) {
                res.json({
                    redirect: '/home'
                });
            } else {
                const commentObject = comments[0]
                const commentOwner = await this.db.fetchUserUsingID(commentObject.user_id);
                const commentOwnerDecoration = await this.db.fetchProfileDecoration(commentObject.user_id);
                res.json({
                    user_id: commentObject.user_id,
                    user: commentOwner[0].username,
                    profile_picture: commentOwnerDecoration[0].profile_picture_image_url,
                    post_id: commentObject.post_id,
                    description: commentObject.description
                });
            }
        } catch (error){
            res.status(400).send(error)
        }
    }
}

