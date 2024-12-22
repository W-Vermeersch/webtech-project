import * as express from "express";
import { BaseDatabaseController } from "../base.database.controller";
import Database from "../../../database";
import { authenticateToken, ifAuthenticatedToken } from "../../user-authentification";

export class FetchUserInformationController extends BaseDatabaseController {
  constructor(private db: Database) {
    super();
  }

  initializeRoutes(): void {
    this.router.get(
      "/fetch/user/profile",
      ifAuthenticatedToken,
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
        "/fetch/user/liked-posts",
        (req: express.Request, response: express.Response) => {
          return this.getUserLikedPosts(req, response);
        }
    );

    this.router.get(
      "/fetch/user/followers",
      ifAuthenticatedToken,
      (req: Express.Request, response: Express.Response) => {
      return this.getUserFollowers(req, response);
    });

    this.router.get(
      "/fetch/user/following",
      ifAuthenticatedToken,
      (req: Express.Request, response: Express.Response) => {
      return this.getUserFollowed(req, response);
    });

    this.router.get(
      "/fetch/user/follower-amount", 
      (req: Express.Request, response: Express.Response) => {
      return this.getUserFollowerAmount(req, response);
    });

    this.router.get(
      "/fetch/user/followed-amount", 
      (req: Express.Request, response: Express.Response) => {
      return this.getUserFollowedAmount(req, response);
    });

    this.router.get("/fetch/user/is-following", 
      ifAuthenticatedToken, 
      (req: express.Request, response: express.Response) => {
      return this.isUserFollowed(req, response);
    });

    this.router.get(
      "/fetch/leaderboard-exp",
      (req: express.Request, response: express.Response) => {
        return this.getLeaderboardExp(req, response);
      });

      this.router.get(
        "/fetch/leaderboard-followers",
        (req: express.Request, response: express.Response) => {
          return this.getLeaderboardFollowers(req, response);
        });

    this.router.get(
      "/fetch/search/user", 
      ifAuthenticatedToken,
      (req: Express.Request, response: Express.Response) => {
      return this.getUserSearchResults(req, response);
    });

  
  }

/*
Helper function that returns all the user information needed for the front-end.
IsFollowed will result in false if the user is not authenticated, and will result if the user follows the specified user if they are authenticated.
*/
  private async fetchUser(user_id_to_fetch: number, user_id: number) {
    const userToFetch = await this.db.fetchUserUsingID(user_id_to_fetch);
    if (userToFetch.length === 0) {
        throw new Error("No user found.");
        }
    const userToFetchObject = userToFetch[0];
    const userToFetchProfileDecoration = await this.db.fetchProfileDecoration(user_id_to_fetch);
    const followHandler = await this.processFollow(user_id_to_fetch, user_id)

    return {
      username: userToFetchObject.username,
      user_id: user_id_to_fetch,

      profilepicture: userToFetchProfileDecoration.profilePicture,
      bio: userToFetchProfileDecoration.bio,
      totalexp: userToFetchProfileDecoration.xp,
      badges: userToFetchProfileDecoration.badges,

      followers: followHandler.followers,
      following: followHandler.following,
      follower_amount: followHandler.follower_amount,
      following_amount: followHandler.following_amount,
      isFollowed: followHandler.isFollowed
    }
}
/*Helper function that handles the follower values. If the useris not authenticate, IsFollowed will defqult to false.*/
private async processFollow(user_id_to_fetch: number, user_id: number) {
  const followers_id_list = await this.db.fetchUserFollowers(user_id_to_fetch);
  const followed_id_list = await this.db.fetchUserFollowed(user_id_to_fetch);
  const follower_list = await Promise.all(followers_id_list.map(async (follower_id) => 
    {
      return (await this.db.fetchUserUsingID(follower_id))[0].username;
    }));
  const followed_list = await Promise.all(followed_id_list.map(async (followed_id) => 
    {
      return (await this.db.fetchUserUsingID(followed_id))[0].username;
    }));

  const followerAmount = follower_list.length;
  const followedAmount = followed_list.length;

  let followed: boolean;
  if (followers_id_list.includes(user_id)) {
    followed = true;
  } else {
    followed = false;
  }
  return {
    followers: follower_list,
    following: followed_list,
    follower_amount: followerAmount,
    following_amount: followedAmount,
    isFollowed: followed,
  }
}

  /*
  Returns a user's profile information given their username. 
  User does not need to be authenticated but will check if the user is following the specified user if they are authenticated.
  */
  private async getProfileInformation(req, res) {
    const username = req.query.username;
    if (!username) {
      return res
        .status(400)
        .json({ error: "Username or user ID must be provided" });
    }
    console.log("username: "+ username)
    let user_to_fetch_object = await this.db.fetchUserUsingUsername(username);
    if (user_to_fetch_object.length == 0) {
      return res.status(404).send("Username not found in DB")
    } 
    console.log("user_to_fetch_object: " + user_to_fetch_object)
    const user_id_to_fetch = user_to_fetch_object[0].user_id;
    const user_id = req.userId;

    res.json(await this.fetchUser(user_id_to_fetch, user_id));
  }

/*Returns all comments a user has made*/
  private async getUserComments(req: express.Request, res: express.Response) {
    try {
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
    } catch (error){
      res.status(400).send(error)
    }
  }
  /*Returns all posts a user has liked.*/
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
  /*Returns a list of the user's followers.*/
  private async getUserFollowers(req, res) {
    if (!req.query.username) {
        res.status(404).send("Parameter 'username' was not found/does nit exist");
    } else {
    const username = req.query.username;
    const userObject = await this.db.fetchUserUsingUsername(username.toString())
    if (userObject[0] == undefined) {
      res.status(404).send("username was not found in the database");
    } else {
      const user_id_to_process = userObject[0].user_id;
      const follower_id_list = await this.db.fetchUserFollowers(user_id_to_process);
      const users = await Promise.all(follower_id_list.map(async (follower_id) => {
        return await this.fetchUser(follower_id, req.userId)
      }));
      res.json({
        users: users,
      })
    }
  }
  }
  /*Returns a list of the user's following users*/
  private async getUserFollowed(req, res) {
    if (!req.query.username) {
        res.status(404).send("Parameter 'username' was not found/does nit exist");
    } else {
    const username = req.query.username;
    const userObject = await this.db.fetchUserUsingUsername(username.toString())
    if (userObject[0] == undefined) {
      res.status(404).send("username was not found in the database");
    } else {
      const user_id_to_process = userObject[0].user_id;
      const follower_id_list = await this.db.fetchUserFollowed(user_id_to_process);
      const users = await Promise.all(follower_id_list.map(async (follower_id) => {
        return await this.fetchUser(follower_id, req.userId)
      }));
      res.json({
        users: users,
      })
    }
  }
  }
  /*Returns a user's follower-count*/
  private async getUserFollowerAmount(req, res) {
    if (!req.query.username) {
        res.status(404).send("username param does not exist.")
    }
    const user_id = (await this.db.fetchUserUsingUsername(req.query.username.toString()))[0].user_id;
    if (user_id != null) {
      const user_followers = await this.db.fetchUserFollowers(user_id)
      res.json({
          nr_of_followers: user_followers.length
          });  
      } else {
        res.status(404).send("Username not found in DB.")
      }

  }
  /*Returns a user's following-count*/
  private async getUserFollowedAmount(req, res) {
    if (!req.query.username) {
        res.status(404).send("username param does not exist.")
    }
    const user_id = (await this.db.fetchUserUsingUsername(req.query.username.toString()))[0].user_id;
    if (user_id != null) {
      const user_followed = await this.db.fetchUserFollowed(user_id)
      res.json({
          nr_of_followed: user_followed.length
          });  
      } else {
        res.status(404).send("Username not found in DB.")
      }
  }

  /*Returns if the user follows a given user.*/
  private async isUserFollowed(req: express.Request, res: express.Response){
    if (!req.query.username) {
        res.status(404).send("username_to_check param does not exist")
    } else {
    // @ts-ignore
    const user_id = req.userId;
    if (user_id !== -1) {
      const user_id_to_check = (await this.db.fetchUserUsingUsername(req.query.username.toString()))[0].user_id;
      const user_to_check_follower_list = (await this.db.fetchUserFollowers(user_id_to_check))
      return res.json({
          following: user_to_check_follower_list.includes(user_id)
      });
    } else {
    res.json({
      following: false
    });
    }
  }
  }
  
  /*Returns a list of the top 10 users based of off total exp count*/
  private async getLeaderboardExp(req: express.Request, res: express.Response) {
    const users = await this.db.fetchTopTenExp();
    const topTenUsers = await Promise.all(users.map(async (user) => {
      const user_id = user.user_id;
      const totalexp = user.totalexp;
      const userObject = await this.db.fetchUserUsingID(user_id);
      const username = userObject[0].username;
      user = {
        username: username,
        totalexp: totalexp,
      };
      return user;
    }))

      res.json({
        users: topTenUsers
      })
}
/*Returns a list of the top 10 users based of off follower-count*/
private async getLeaderboardFollowers(req: express.Request, res: express.Response) {
  const users = await this.db.fetchTopTenFollowers();
  const topTenUsers = await Promise.all(users.map(async (user) => {
    const user_id = user.user_id;
    const userObject = await this.db.fetchUserUsingID(user_id);
    const username = userObject[0].username;
    user = {
      username: username,
      follower_count: user.follower_count,
    };
    return user;
  }))
    console.log(users)
    res.json({
      users: topTenUsers
    })
}
/*Function that handles searching for users. Returns a list of all users matching the specified string.*/
  private async getUserSearchResults(req, res) {
    const searchQuery = req.query.username; 
    const matchingUsers = await this.db.fetchUsersMatchingSearch(searchQuery);
    const user_list = await Promise.all(matchingUsers.map(async (user) => {
        const user_id_to_process = user.user_id;
        return await this.fetchUser(user_id_to_process, req.userId);
    }));
    res.json({
      users: user_list,
    });
  }
}
