import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";
import {ErrorInLogInForm, LogInForm} from "../../../../Global/log-in-forms";
import {CommentForms, ErrorInCommentInForm} from "../../../../Global/comment-forms";
import { Comment } from "../../../interfaces"


export class StoreCommentInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {
        this.router.post("/store/comment", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.storeComment(req, response);
        });
    }

    /*
    Function that stores comments.
    User must be authenticated, user information is fetched using the access token.
    Perfoms form validation before letting the user post a comment.
    */
    private async storeComment(req, res): Promise<void> {
        try {
            const inputs: CommentForms = new CommentForms();
            inputs.user_id = req.user.user_id; 
            inputs.description = req.body.description
            inputs.post_id = req.body.post_id

            const errors: ErrorInCommentInForm = new ErrorInCommentInForm();
            const comment: Comment = {
                comment_id: 0,
                user_id: inputs.user_id,
                post_id: inputs.post_id,
                description: inputs.description
            }

            if (!comment.description || comment.description == "") {
                errors.description = "Please enter a description";
                inputs.description = "";
            }

            if (errors.hasErrors()) {
                res.status(206).json({
                    errors: errors.toObject(),
                    inputs: inputs.toObject(),
                });
            } else {
                await this.db.storeComment(comment);
                res.status(200).send("succesfully stored the comment")
            }
        } catch (error){
            res.status(400).send(error)
        }
    }

}