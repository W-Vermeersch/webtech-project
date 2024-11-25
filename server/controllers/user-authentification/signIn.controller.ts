import {UserAuthentificationController} from "./base.user.controller";
import express = require("express");
import {SignInForm, ErrorInForm} from "../../../Global/sign-in-form";
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

    addPost(req: express.Request, res: express.Response): void {

        const inputs: SignInForm  = new SignInForm();
        inputs.fill(req.body);
        const errors: ErrorInForm = new ErrorInForm();

        if (!this._isGiven(inputs.firstName)) {
            errors.firstName = "Please enter your first name.";
            inputs.firstName = "";
        }
        if (!this._isGiven(inputs.lastName)) {
            errors.lastName = "Please enter your last name.";
            inputs.lastName = "";
        }
        if (this._isEmailValid(inputs.email)) {
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
        } else if (!this.samePassword(inputs.password, inputs.passwordConfirm)){
            inputs.password = "";
            inputs.passwordConfirm = "";
            errors.passwordConfirm = "Please repeat the same password.";

        }

        if (errors.hasErrors()) {
            res.status(206).json({
                errors: errors.toObject(),
                inputs: inputs.toObject()
            })
        } else {
            this.db.storeUser(inputs.firstName + ' ' + inputs.lastName, inputs.firstName, inputs.lastName, inputs.email, inputs.password)
            res.json({ redirect: '/home' });
        }
    }

    /**
     * Check if a string is actually provided
     *
     * @param {string} param Provided string
     * @returns {boolean} Valid or not
     */
    private _isGiven(param: string): boolean {
        if (param == null)
            return false;
        else{
            return param.trim().length > 0;
        }
    }

    /**
     * Check if a string is a valid email
     *
     * @param {string} email Email string
     * @returns {boolean} Valid or not
     */
    private _isEmailValid(email: string): boolean {
        const atIdx = email.indexOf("@");
        const dotIdx = email.indexOf(".");

        return atIdx != -1 && dotIdx != -1 && dotIdx > atIdx;
    }
    private samePassword(password1: string, password2: string): boolean {
        return password1 === password2
    }
    private _isGoodPassword(password: string): boolean {
        return password.length >= 8;
    }
}