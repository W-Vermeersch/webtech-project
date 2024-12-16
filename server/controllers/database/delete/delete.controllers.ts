import * as express from "express";
import { BaseDatabaseController } from "../base.database.controller";
import Database from "../../../database";
import { authenticateToken } from "../../user-authentification";
import {Post} from "../../../interfaces";

export class DeleteController extends BaseDatabaseController {
  constructor(private db: Database) {
    super();
  }

  initializeRoutes(): void {
    this.router.delete(
        "/delete/user/delete-user",
        authenticateToken,
        (req: express.Request, response: express.Response) => {
          return this.deleteUser(req, response);
        }
    );

    this.router.delete(
        "/delete/user/delete-like",
        authenticateToken,
        (req: express.Request, response: express.Response) => {
          return this.deleteLike(req, response);
        }
    );

    this.router.delete(
        "/delete/comment/delete",
        authenticateToken,
        (req: express.Request, response: express.Response) => {
          return this.deleteComment(req, response);
        }
    );

    this.router.delete(
        "/delete/post/delete",
        authenticateToken,
        (req: express.Request, response: express.Response) => {
          return this.deletePost(req, response);
        }
    );
  }

  private async deleteUser(req, res) {
    try {
      const username = req.user.username; //get username from the access token
      const users = await this.db.fetchUserUsingUsername(username.toString());
      if (users.length === 0) {
        res.json({
          redirect: "/home",
        });
      } else {
        const userObject = users[0];
        const user_id = userObject.user_id;

        await this.db.deleteUser(username.toString(), user_id);
        await this.db.deleteUserDecoration(user_id);
      }
    } catch (error){
      res.status(400).send(error)
    }
  }

  private async deleteLike(req, res) {
    try {
      const username = req.user.username;
      const post_id = parseInt(req.query.post_id.toString());

      const users = await this.db.fetchUserUsingUsername(username.toString());
      if (users.length === 0) {
        res.json({
          redirect: "/home",
        });
      } else {
        const userObject = users[0];
        const user_id = userObject.user_id;

        let likedPostsOfUser: number[] = (await this.db.fetchLikedPostsOfUser(user_id))
            .map((post: Post) => {
              return post.post_id
            });
        if (!likedPostsOfUser.includes(post_id)) {
          res.status(404).send("User has not liked this post");
        } else {
          await this.db.deleteLike(user_id, post_id);
          return res.status(200).send("Like successfully removed");
        }
      }
    } catch (error){
      res.status(400).send(error)
    }
  }
  private async deleteComment(req: express.Request, res: express.Response) {
    try {
      const comment_id = parseInt(req.query.comment_id.toString());
      const comments = await this.db.fetchCommentByIds([comment_id]);
      if (comments.length === 0) {
        res.json({
          redirect: "/home",
        });
      } else {
        await this.db.deleteComment(comment_id);
      }
    } catch (error){
      res.status(400).send(error)
    }
  }
  private async deletePost(req: express.Request, res: express.Response) {
    try {
      const post_id = parseInt(req.query.post_id.toString());
      const posts = await this.db.fetchCommentByIds([post_id]);
      if (posts.length === 0) {
        res.json({
          redirect: "/home",
        });
      } else {
        await this.db.deletePost(post_id);
      }
    } catch (error){
      res.status(400).send(error)
    }
  }
}
