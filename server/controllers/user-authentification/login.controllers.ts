import {UserAuthentificationController} from "./base.user.controller";
import * as express from "express";
import {LogInForm, ErrorInLogInForm} from "../../../Global/log-in-forms"
import Database from "../../database";
import jwt = require("jsonwebtoken");
require("dotenv").config();

export class LogInController extends UserAuthentificationController {
    public constructor(private db: Database) {
        super();
    }

    initializeRoutes(): void {
        //post request because we are generating and passing a token
        this.router.post("/log-in", (req: express.Request, response: express.Response) => {
            return this.logIn(req, response);
        });
    }

    logIn(req: express.Request, res: express.Response): void {
        const inputs: LogInForm = new LogInForm();
        //console.log(req.body)
        inputs.fill(req.body);
        const errors: ErrorInLogInForm = new ErrorInLogInForm();
        const usernameOrEmail = inputs.usernameOrEmail;
        const password = inputs.password;

        //check if input fields are filled
        if (!this._isGiven(inputs.usernameOrEmail)) {
            errors.usernameOrEmail = "Please enter your username or e-mail.";
            inputs.usernameOrEmail = "";
        }
        if (!this._isGiven(inputs.password)) {
            errors.password = "Please enter a password.";
            inputs.password = "";
        }

        //authenticate user (we might want to add hashed passwords in the future)
        const user: any = this.db.fetchUserUsingEmailOrUsername(usernameOrEmail);
        if (user.length === 0) {
            errors.usernameOrEmail = "Username or e-mail not found."
            inputs.usernameOrEmail = "";
        }
        if (user.length >= 1) {
            const userPassword = user[2]
            if (password != userPassword) {
                errors.password = "Password incorrect!"
                inputs.password = "";
            }
        }

        if (errors.hasErrors()) {
            res.status(206).json({  //moet verandert worden waarschijnlijk
                errors: errors.toObject(),
                inputs: inputs.toObject()
            })
        } else {
            // handle sessions
            const username = user[1]
            const userObject = {username: username}
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

            res.json({accessToken: accessToken});
            res.json({redirect: '/home'});
        }
    }

    private _isGiven(param: string): boolean {
        if (param == null)
            return false;
        else {
            return param.trim().length > 0;
        }
    }
}


export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // = if a auth header exists give the token else return null for errors
    //check if we have a valid token
    if (token == null) return res.status(401).send("Unauthorized, no authentication header found");
    //verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: Error, user) => {
        if (err) res.status(403).send("Unauthorized, provided token is no longer valid");
        //we now know the user is validated
        req.user = user; //PROBLEM: req does not have a user field
        next();
    })

}



