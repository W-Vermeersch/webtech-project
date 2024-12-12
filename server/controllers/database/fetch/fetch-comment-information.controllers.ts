import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";

export class FetchCommentInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {

        this.router.get("/fetch/comment/information", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getCommentInformation(req, response);
        });
    }

    private async getCommentInformation(req: express.Request, res: express.Response) {
        const comment_id = parseInt(req.query.comment_id.toString());
        const comments = await this.db.fetchCommentByIds([comment_id])
        if (comments.length === 0) {
            res.json({
                redirect: '/home'
            });
        } else {
            const commentObject = comments[0]
            const commentOwner = this.db.fetchUserUsingID(commentObject.user_id);
            res.json({
                username: commentOwner,
                user_id: commentObject.user_id,
                description: commentObject.description
            });
        }
    }
}

