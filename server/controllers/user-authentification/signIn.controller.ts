import {UserAuthentificationController} from "./base.user.controller";
import * as express from "express";
import {SignInForm, ErrorInSignInForm} from "../../../Global/sign-in-form";
import Database from "../../database";

export class SignInController extends UserAuthentificationController{
    public constructor(private db: Database) {
        super();
    }

    initializeRoutes(): void {

        this.router.post("/sign-in", (req: express.Request, response: express.Response) => {
            return this.addPost(req, response);
        });
    }

    async addPost(req: express.Request, res: express.Response): Promise<void> {
        const inputs: SignInForm = new SignInForm();
        console.log(req.body)
        inputs.fill(req.body);
        const errors: ErrorInSignInForm = new ErrorInSignInForm();

        if (!this._isGiven(inputs.username)) {
            errors.username = "Please enter your username.";
            inputs.username = "";
        }

        if (!this._isEmailValid(inputs.email)) {
           errors.email = "Please enter a valid email address.";
           inputs.email = "";
        }

        if (!this._isGiven(inputs.password)) {
            errors.password = "Please enter a password.";
            inputs.password = "";
        } else if (!this._isGoodPassword(inputs.password)) {
            errors.password = "Password must have a minimum length of 8 characters ans must contain special characters.";
        }
        if (!this._isGiven(inputs.passwordConfirm)) {
            errors.passwordConfirm = "Please confirm your password.";
            inputs.passwordConfirm = "";
        } else if (!this.samePassword(inputs.password, inputs.passwordConfirm)) {
            inputs.password = "";
            inputs.passwordConfirm = "";
            errors.passwordConfirm = "Please repeat the same password.";
        }
        const lookupUsername = await this.db.fetchUserUsingEmailOrUsername(inputs.username)
        if (lookupUsername.length != 0) {
            errors.username = "This username is taken.";
            inputs.username = "";
        }
        const lookupEmail = await this.db.fetchUserUsingEmailOrUsername(inputs.email)
        if (lookupEmail.length != 0) {
            errors.email = "This E-mail already has an account linked to it.";
            inputs.email = "";
        }
        if (errors.hasErrors()) {
            res.status(206).json({
                errors: errors.toObject(),
                inputs: inputs.toObject()
            });
        } else {
            await this.db.storeUser(inputs.username, inputs.email, inputs.password);
            const user_id = await this.db.getUserID(inputs.username);
            await this.db.storeProfileDecoration(user_id, inputs.username, "");
            res.json({ redirect: '/user/log-in' });
        }
    }
}