import {UserAuthentificationController} from "./base.user.controller";
import express = require("express");
import {User} from "../../Modules/User";


export class SignInController extends UserAuthentificationController{


    initializeRoutes(): void {

        this.router.post("/sign-in", (req: express.Request, response: express.Response) => {
            return this.addPost(req, response);
        });

        // this.router.get("/success", (req: express.Request, res: express.Response) => {
        //     return this.openSuccess(req, res);
        // })
    }

    openAddPost(req: express.Request, res: express.Response): void {
        const sessionData: any = req.session;
        const inputs = new Map<string, string>();
        inputs.set("userName", "Stupid");
        sessionData.inputs = Object.fromEntries(inputs);
        res.render("addUser", {});
    }

    addPost(req: express.Request, res: express.Response): void {
        console.log("POST request received for /sign-in");
        console.log(req.body);

        // Contains the errors found during validation
        const errors = new Map<string, string>();
        // Contains the input values that validated correctly
        // This way, when an error is found you only have to retype the wrong fields
        const inputs = new Map<string, string>();

        // Get the form field called "username" that was posted here
        const username: string = req.body.userName;
        // User name is mandatory: first check whether it was given
        if (!this._isGiven(username)) {
            // If an error occurs, put it in the "errors" datastructure
            // The next line means we will dusplay "Please enter a username" in the HTML element called "userNameError"
            errors.set("userNameError", "Please enter a username.");
        } else {
            // If a value was entered correctly, put it in the "inputs" datastructure
            // In this case the value will be placed in the HTML input field "userName" because it was correct
            inputs.set("userName", username);
        }

        const sessionData: any = req.session;
        if (errors.size > 0) {
            sessionData.errors = Object.fromEntries(errors);
            sessionData.inputs = Object.fromEntries(inputs);
            // res.redirect("add"); // Redirect to GET http://localhost:5555/add
        } else {
            sessionData.errors = {};
            sessionData.inputs = {};
            sessionData.user = {
                username
            } as User;
            // res.redirect("success"); // Redirect to GET http://localhost:5555/success
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
        else
            return param.trim().length > 0;
    }

    openSuccess(req: express.Request, res: express.Response): void {
        res.render("success");
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
}