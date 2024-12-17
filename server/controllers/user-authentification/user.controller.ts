import {BaseController} from "../base.controller";
import * as express from "express";
import { LogInForm, ErrorInLogInForm } from "../../../Global/log-in-forms";
import Database from "../../database";
import * as jwt from "jsonwebtoken";
import { ref } from "yup";
import {hashPassword, validPassword} from "./password.encryption";
import {ErrorInSignInForm, SignInForm} from "../../../Global/sign-in-form";
import {User} from "../../interfaces";
require("dotenv").config();

interface JwtPayloadCustom {
    username: string;
    user_id: number;
    iat: number;
    exp: number;
}

export class UserAuthenticationController extends BaseController {
    constructor(private db: Database) {
        super("/user");
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
            const cookies = req.cookies;
            if (!cookies?.refreshToken) return res.sendStatus(204);
            const refresh_token = cookies.refreshToken;
            //console.log("logging out, list before: " + this.refreshTokens);
            this.refreshTokens = this.refreshTokens.filter(
                ({ username, refreshToken }) => refreshToken !== refresh_token
            );
            res.clearCookie("refreshToken", { httpOnly: true });
            res.clearCookie("shown_post_ids") // temporary to clear the shown_post_ids cookie -> remove when app done
            //console.log("logging out, new list: " + this.refreshTokens);
            return res.status(204).send("Succesfully deleted refresh token");
        });

        this.router.post("/sign-in", (req: express.Request, response: express.Response) => {
            return this.signIn(req, response);
        });
    }

    private generateAccessToken(user) {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined");
        }
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });
    }

    // need to save the refreshtoken - user relationship in the backend !
    refreshTokens: { username: string; refreshToken: string }[] = []; //needs to be replaced with the DB later

    private handleRefreshToken(req, res) {
        const user: string = req.body.user;
        const cookies = req.cookies;
        if (!cookies?.refreshToken)
            return res.status(401).send("Unauthorized, refreshToken is null");

        const refreshToken: string = cookies.refreshToken;
        if (refreshToken == null)
            return res.status(402).send("No refreshToken provided");

        const foundRefreshTokenPair = this.refreshTokens.find(
            (token) => token.refreshToken === refreshToken
        );
        if (!foundRefreshTokenPair)
            return res.status(403).send("Unauthorized, refreshToken expired");

        const foundUsername = foundRefreshTokenPair.username;

        interface DecodedUser {
            username: string;
            user_id: number;
        }

        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            return res
                .status(500)
                .send("Internal server error, REFRESH_TOKEN_SECRET is not defined");
        }
        if (!jwt.verify(refreshToken, refreshTokenSecret))
            return res
                .status(403)
                .send("Unauthorized, provided refresh token is not valid");

        interface Decoded {
            userObject: DecodedUser;
            iat: number;
            exp: number;
        }
        const decoded = jwt.decode(refreshToken, { complete: false }) as Decoded;
        if (!decoded)
            return res
                .status(403)
                .send("Unauthorized, provided refresh token is not valid");

        const username = decoded.userObject.username;
        const user_id = decoded.userObject.user_id;

        if (foundUsername !== username)
            return res
                .status(403)
                .send("Unauthorized, provided refresh token is not valid");
        const accessToken = this.generateAccessToken({
            username: username,
            user_id: user_id,
        });
        res.json({
            accessToken: accessToken,
            username: username,
            userID: user_id,
        });
    }


    async logIn(req: express.Request, res: express.Response): Promise<void> {
        const inputs: LogInForm = new LogInForm();
        //console.log(req.body);
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
        const user: any = await this.db.fetchUserUsingEmailOrUsername(
            usernameOrEmail
        );
        //console.log("user[0].username: "+ user[0].username)
        if (user.length === 0) {
            //console.log("username or email not found")
            errors.usernameOrEmail = "Username or e-mail not found.";
            inputs.usernameOrEmail = "";
        }
        if (user.length != 0) {
            const userPassword = user[0].password;
            const userEmail = user[0].email;
            //console.log("user password: " + user[0].password + "Given password: " + password)
            if (!validPassword(password, userEmail, userPassword)){
                errors.password = "Password incorrect!";
                inputs.password = "";
            }
        }

        if (errors.hasErrors()) {
            res.status(206).json({
                //moet verandert worden waarschijnlijk
                errors: errors.toObject(),
                inputs: inputs.toObject(),
            });
        } else {
            // handle sessions
            // console.log("handling tokens")
            const user_id = user[0].user_id;
            const username = user[0].username;
            interface DecodedUser {
                username: string;
                user_id: string;
            }
            const userObject = {
                username: username,
                user_id: user_id,
            } as DecodedUser;

            const accessToken = this.generateAccessToken(userObject);
            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
            if (!refreshTokenSecret) {
                throw new Error("REFRESH_TOKEN_SECRET is not defined");
            }
            const refreshToken = jwt.sign({ userObject }, refreshTokenSecret, {
                expiresIn: "7d",
            });
            this.refreshTokens.push({ username, refreshToken }); // adding username to array
            res.cookie("refreshToken", refreshToken, {
                // httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
            }); // 7 days
            res.json({
                accessToken: accessToken,
                username: username,
                userID: user_id,
                redirect: "/home",
            });
        }
    }

    async signIn(req: express.Request, res: express.Response): Promise<void> {
        const inputs: SignInForm = new SignInForm();
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
            const user: User = {
                user_id: null,
                username: inputs.username,
                email: inputs.email,
                password: hashPassword(inputs.password, inputs.email)
            }
            await this.db.storeUser(user);
            user.user_id = await this.db.getUserID(inputs.username);
            await this.db.storeProfileDecoration(user, "");
            res.json({ redirect: '/user/log-in' });
        }
    }

    /**
     * Check if a string is actually provided
     *
     * @param {string} param Provided string
     * @returns {boolean} Valid or not
     */
    protected _isGiven(param: string): boolean {
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
    protected _isEmailValid(email: string): boolean {
        const atIdx = email.indexOf("@");
        const dotIdx = email.lastIndexOf(".");
        return atIdx != -1 && dotIdx != -1 && dotIdx > atIdx;
    }
    protected samePassword(password1: string, password2: string): boolean {
        return password1 === password2
    }
    protected _isGoodPassword(password: string): boolean {
        return password.length >= 8;
    }
}

export function authenticateToken(req, res, next) {
    const authHeader: string = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // = if a auth header exists give the token else return null for errors
    //check if we have a valid token
    if (token == null)
        return res.json({
            redirect: '/user/log-in'
        })
    //verify the token
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        return res
            .status(500)
            .send("Internal server error, ACCESS_TOKEN_SECRET is not defined");
    }
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err)
            return res
                .status(403)
                .send("Unauthorized, provided token is no longer valid");
        //we now know the user is validated
        req.user = user;
        //console.log(user.user.user_id)
        next();
    });
}

export function ifAuthenticatedToken(req, res, next){
    try {
        const authHeader: string = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // = if a auth header exists give the token else return null for errors
        if (token !== null) {
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
            if (!accessTokenSecret) {
                req.userId = -1;
            } else {
                jwt.verify(token, accessTokenSecret, (err, user) => {
                    if (err){
                        req.userId = -1;
                    } else {
                    const userPayload = user as JwtPayloadCustom;
                    req.userId = userPayload.user_id;
                    req.username = userPayload.username
                    }
                });
            }
        }
    } catch {
            req.userId = -1; // No user found
    } finally {
        if (!req.userId){
            req.userId = -1
        }
        next()
    }
}