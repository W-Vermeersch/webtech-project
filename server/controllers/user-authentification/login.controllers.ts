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
            const refresh_token = req.headers['refresh-token'];
            console.log("logging out, list before: " + this.refreshTokens);
            this.refreshTokens = this.refreshTokens.filter(token => token !== refresh_token);
            console.log("logging out, new list: " + this.refreshTokens);
            return res.status(204).send("Succesfully deleted refresh token");
        })
    }

    private generateAccessToken(user) {
        return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }) 
    }
    
    refreshTokens = []  //needs to be replaced with the DB later

    private handleRefreshToken(req, res) {
        const refreshToken = req.body.token
        if (refreshToken == null) 
            return res.status(401).send("Unauthorized, refreshToken is null");
        if (!this.refreshTokens.includes(refreshToken))
            return res.status(403).send("Unauthorized, refreshToken expired");
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).send("Unauthorized, provided refresh token is not valid");
            const accessToken = this.generateAccessToken({username: user.name});
            res.json({accessToken: accessToken});
        })
    }

    async logIn(req: express.Request, res: express.Response): Promise<void> {
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
        const user: any = await this.db.fetchUserUsingEmailOrUsername(usernameOrEmail);
        //console.log("user[0].username: "+ user[0].username)
        if (user.length === 0) {
            console.log("username or email not found")
            errors.usernameOrEmail = "Username or e-mail not found."
            inputs.usernameOrEmail = "";
        }
        if (user.length != 0) {
            const userPassword = user[0].password
            console.log("user password: " + user[0].password + "Given password: " + password)
            if (password != userPassword) {
                console.log("password incorrect")
                errors.password = "Password incorrect!"
                inputs.password = "";
            }
        }

        if (errors.hasErrors()) {
            console.log("has errors")
            console.log(errors)
            res.status(206).json({  //moet verandert worden waarschijnlijk
                errors: errors.toObject(),
                inputs: inputs.toObject()
            })
        } else {
            // handle sessions
            console.log("handling tokens")
            const user_id = user[0].user_id
            const username = user[0].username
            const userObject = 
            {
                username: username,
                user_id: user_id
            }
            const accessToken = this.generateAccessToken(userObject);
            const refreshToken = jwt.sign({userObject}, process.env.REFRESH_TOKEN_SECRET , { expiresIn: '7d' });
            this.refreshTokens.push(refreshToken);
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                expires: 15,

                username: username,
                userID: user_id,
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
        if (err) return res.status(403).send("Unauthorized, provided token is no longer valid");
        //we now know the user is validated
        req.user = user; //user is a object, to get the values do user.user.username or user_id
        //console.log(user.user.user_id)
        next();
    })
}








