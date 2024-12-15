import * as express from "express";
import { BaseDatabaseController } from "../base.database.controller";
import Database from "../../../database";
import { authenticateToken } from "../../user-authentification";

export class FetchUserInformationController extends BaseDatabaseController {
  constructor(private db: Database) {
    super();
  }

  initializeRoutes(): void {
    this.router.get(
      "/fetch/user/profile",
      (req: express.Request, response: express.Response) => {
        return this.getProfileInformation(req, response);
      }
    );

    this.router.get(
      "/fetch/user/comments",
      (req: express.Request, response: express.Response) => {
        return this.getUserComments(req, response);
      }
    );

    this.router.get(
      "/fetch/user/posts",
      (req: express.Request, response: express.Response) => {
        return this.getUserPosts(req, response);
      }
    );

    this.router.get(
      "/fetch/user/liked-posts",
      (req: express.Request, response: express.Response) => {
        return this.getUserLikedPosts(req, response);
      }
    );
  }

  // All fetching operations require the username inside the request parameters.
  private async getProfileInformation(
    req: express.Request,
    res: express.Response
  ) {
    const username = req.query.username ? req.query.username : "";
    const user_id = req.query.user_id ? req.query.user_id : "";

    let users;
    console.log("username: ", username);
    console.log("user_id: ", user_id);

    if (username) {
      users = await this.db.fetchUserUsingUsername(username.toString());
    } else if (user_id) {
      users = await this.db.fetchUserUsingID(Number(user_id));
    } else {
      return res.status(400).json({ error: "Username or user ID must be provided" });
    }
    console.log("users: ", users);
        if (users.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const userObject = users[0]
            const userProfileDecoration = await this.db.fetchProfileDecoration(userObject.user_id);
            //console.log("user profile decoration: ", userProfileDecoration);
            //console.log(userProfileDecoration[0].display_name)
            res.json({
                username: userObject.username,
                user_id: userObject.user_id,
                profilepicture: userProfileDecoration.profilePicture,
                bio: userProfileDecoration.bio,
                totalexp: userProfileDecoration.xp,
                badges: userProfileDecoration.badges
            });
        }
    }

  private async getUserComments(req: express.Request, res: express.Response) {
    const username = req.query.username ? req.query.username : " ";
    const users = await this.db.fetchUserUsingUsername(username.toString());
    if (users.length === 0) {
      res.json({
        redirect: "/pageNotFound",
      });
    } else {
      const userObject = users[0];
      if (userObject.user_id !== null) {
        const userComments = await this.db.fetchCommentsOfUser(
          userObject.user_id
        );
        res.json({
          user_comments: userComments,
        });
      } else {
        res.status(400).json({ error: "User ID is null" });
      }
    }
  }

  private async getUserPosts(req: express.Request, res: express.Response) {
    const username = req.query.username ? req.query.username : " ";
    const users = await this.db.fetchUserUsingUsername(username.toString());
    if (users.length === 0) {
      res.json({
        redirect: "/pageNotFound",
      });
    } else {
      const userObject = users[0];
      if (userObject.user_id !== null) {
        const userPosts = await this.db.fetchPostsOfUser(userObject.user_id);
        res.json({
          posts: userPosts,
        });
      } else {
        res.status(400).json({ error: "User ID is null" });
      }
    }
  }

  private async getUserLikedPosts(req: express.Request, res: express.Response) {
    const username = req.query.username ? req.query.username : " ";
    const users = await this.db.fetchUserUsingUsername(username.toString());
    if (users.length === 0) {
      res.json({
        redirect: "/pageNotFound",
      });
    } else {
      const userObject = users[0];
      if (userObject.user_id !== null) {
        const likedPosts = await this.db.fetchLikedPostsOfUser(
          userObject.user_id
        );
        res.json({
          user_liked_posts: likedPosts,
        });
      } else {
        res.status(400).json({ error: "User ID is null" });
      }
    }
  }
}
