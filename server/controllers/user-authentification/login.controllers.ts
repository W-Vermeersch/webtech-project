import {UserAuthentificationController} from "./base.user.controller";
import * as express from "express";
import {LogInForm, ErrorInLogInForm} from "../../../Global/log-in-forms"
import Database from "../../database";
import jwt = require("jsonwebtoken");
import { ref } from "yup";
require("dotenv").config();

export class LogInController extends UserAuthentificationController {
    public constructor(private db: Database) {
        super();
    }

    initializeRoutes(): void {
        //post request because we are generating and passing a token
        this.router.post("/log-in", (req, res) => {
            return this.logIn(req, res);
        });

        this.router.post("/token", (req, res) => {
            return this.handleRefreshToken(req, res);
        });

        this.router.delete("/log-out", (req, res) => {
            this.refreshTokens = this.refreshTokens.filter(token => token !== req.body.token);
            return res.status(204).send("Succesfully deleted refresh token");
        })
    }

    private generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }) 
    }
    private generateRefreshToken(user) {
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    }

    refreshTokens = []  //needs to be replaced with the DB later

    private handleRefreshToken(req, res) {
        const refreshToken = req.body.token
        if (refreshToken == null) 
            return res.status(401).send("Unauthorized, refreshToken is null");
        if (!this.refreshTokens.includes(refreshToken))
            return res.status(403).send("Unauthorized, refreshToken expired");
        jwt.verify(refreshToken, process.env.RFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send("Unauthorized, provided refresh token is not valid");
            const accessToken = this.generateAccessToken({username: user.name});
            res.json({accessToken: accessToken});
        })
    }

    logIn(req: express.Request, res: express.Response): void {
        const inputs: LogInForm = new LogInForm();
        console.log(req.body);
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
            const userID = user[0]
            const username = user[1]
            const userObject = {username: username}
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);
            this.refreshTokens.push(refreshToken);
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken,

                username: username,
                userID: userID,
                redirect: '/home'
            });
        }
    }
}


export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]; // = if a auth header exists give the token else return null for errors
    //check if we have a valid token
    if (token == null) return res.status(401).send("Unauthorized, no authentication header found");
    //verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) res.status(403).send("Unauthorized, provided token is no longer valid");
        //we now know the user is validated
        req.user = user;
        next();
    })

}








