import { UserAuthentificationController } from "./base.user.controller";
import * as express from "express";
import { LogInForm, ErrorInLogInForm } from "../../../Global/log-in-forms";
import Database from "../../database";
import * as jwt from "jsonwebtoken";
import { ref } from "yup";
import {validPassword} from "./password.encryption";
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
      const cookies = req.cookies;
      if (!cookies?.refreshToken) return res.sendStatus(204);
      const refresh_token = cookies.refreshToken;
      //console.log("logging out, list before: " + this.refreshTokens);
      this.refreshTokens = this.refreshTokens.filter(
        ({ username, refreshToken }) => refreshToken !== refresh_token
      );
      res.clearCookie("refreshToken", { httpOnly: true });
      //console.log("logging out, new list: " + this.refreshTokens);
      return res.status(204).send("Succesfully deleted refresh token");
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
      //console.log("has errors")
      //console.log(errors)
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
        httpOnly: true,
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
}

export function authenticateToken(req, res, next) {
  const authHeader: string = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // = if a auth header exists give the token else return null for errors
  //check if we have a valid token
  if (token == null)
    return res.status(401).send("Unauthorized, no authentication header found");
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
    req.user = user; //user is a object, to get the values do user.user.username or user_id
    //console.log(user.user.user_id)
    next();
  });
}
