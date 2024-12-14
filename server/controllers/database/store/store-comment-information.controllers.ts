import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken} from "../../user-authentification";
import {ErrorInLogInForm, LogInForm} from "../../../../Global/log-in-forms";
import {CommentForms, ErrorInCommentInForm} from "../../../../Global/comment-forms";


export class StoreCommentInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {

        this.router.post("/store/comment", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.storeComment(req, response);
        });
    }


    private async storeComment(req, res): Promise<void> {
        const inputs: CommentForms = new CommentForms();
        inputs.user_id = req.user.user_id;  //extract from token
        inputs.description = req.body.description
        inputs.post_id = req.body.post_id
     
        const errors: ErrorInCommentInForm = new ErrorInCommentInForm();
        const user_id = inputs.user_id;
        const post_id = inputs.post_id;
        const description = inputs.description;

        if (description == null || description == "") {
            errors.description = "Please enter a description";
            inputs.description = "";
        }

        if (errors.hasErrors()) {
            res.status(206).json({
                errors: errors.toObject(),
                inputs: inputs.toObject(),
            });
        } else {
            await this.db.storeComment(user_id, post_id, description);
            res.status(200).send("succesfully stored the comment")
        }
    }

}