import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {authenticateToken, ifAuthenticatedToken} from "../../user-authentification";

interface comment {
    user: string,
    profile_picture: String[],
    text: string,
}

interface Post {
    idx: number,
    user: String,
    profile_picture: String[],
    image_url: String[],
    description: String,
    tags: String[],
    score: number,
    rarity: number,
    location: {
        latitude: Number,
        longitude: Number
    },
    likes: number,
    liked: boolean,
    comments: comment[],
}

export class FetchPostInformationController extends BaseDatabaseController {

    constructor(private db: Database) {
        super()
    }

    initializeRoutes(): void {

        this.router.get("/fetch/post/information", ifAuthenticatedToken, (req: express.Request, response: express.Response) => {
            return this.getPostInformation(req, response);
        });

        this.router.get("/fetch/post/random-posts", ifAuthenticatedToken, (req: express.Request, response: express.Response) => {
            return this.getRandomPosts(req, response);
        });

        this.router.get("/fetch/post/comments", (req: express.Request, response: express.Response) => {
            return this.getPostComments(req, response);
        });

        this.router.get("/fetch/post/like-amount", (req: express.Request, response: express.Response) => {
            return this.getPostLikesAmount(req, response);
        });

        this.router.get("/fetch/post/nearest", ifAuthenticatedToken, (req: express.Request, response: express.Response) => {
            return this.getNearestPosts(req, response);
        });

        this.router.get("/fetch/post/within-radius", ifAuthenticatedToken, (req: express.Request, response: express.Response) => {
            return this.getPostsWithinRadius(req, response);
        });

        this.router.get("/fetch/search/tag", ifAuthenticatedToken, (req: express.Request, response: express.Response) => {
            return this.getTagPosts(req, response);
        });

        this.router.get("/fetch/post/liked", ifAuthenticatedToken, (req: express.Request, response: express.Response) => {
            return this.isPostLiked(req, response);
        });

        this.router.get("/fetch/post/get-random-follower-posts", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getRandomFollowerPosts(req, response);
        });

        this.router.get("/fetch/search/tag-and-followers", authenticateToken, (req: express.Request, response: express.Response) => {
            return this.getFollowerAndTagPosts(req, response);
        });

    }

    private async processLikesOfPost(post_id: number, user_id: number): Promise<{ isLiked: boolean, likes: number }> {
        return await this.db.fetchLikedUsersOfPost(post_id).then((res) => {
            const resp = {isLiked: false, likes: 0}
            if (res.includes(user_id)) {
                resp.isLiked = true;
            }
            resp.likes = res.length;
            return resp;
        })
    }

    private async getPostInformation(req: express.Request, res: express.Response) {
        try {
            if (!req.query.post_id) {
                return res.json({
                    redirect: '/pageNotFound'
                });
            }
            const post_id = parseInt(req.query.post_id.toString());

            // @ts-ignore
            this.fetchPost(post_id, req.userId).then((val) => {
                return res.json(val)
            }).catch((error) => {
                console.log(error)
                return res.json({
                    redirect: '/pageNotFound'
                });
            })
        } catch (error){
            res.status(400).send(error)
        }
    }

    private async fetchComments(postId: number): Promise<comment[]> {
        return this.db.fetchCommentsOfPost(postId)
            .then(async val => {
                return await Promise.all(val.map(async (val) => {
                    const postOwnerDecoration = await this.db.fetchProfileDecoration(val.user_id);
                    return {
                        id: val.comment_id,
                        user: postOwnerDecoration.name,
                        profile_picture: postOwnerDecoration.profilePicture,
                        text: val.description,
                    }
                }))
            }).catch(() => {
                return []
            })
    }

    private async fetchPost(postId: number, userId: number): Promise<Post> {
        const posts = await this.db.fetchPostsByIds([postId])
        if (posts.length === 0) {
            throw new Error("No posts found.");
        }
        const postObject = posts[0]
        const postOwner = (await this.db.fetchUserUsingID(postObject.user_id))[0];
        const postOwnerDecoration = await this.db.fetchProfileDecoration(postObject.user_id);
        const likes = await this.processLikesOfPost(postId, userId);
        const comments = await this.fetchComments(postId);
        return {
            idx: postId,
            user: postOwner.username,
            profile_picture: postOwnerDecoration.profilePicture,
            image_url: postObject.image_url,
            description: postObject.description,
            tags: postObject.tags,
            score: postObject.score,
            rarity: postObject.rarity,
            location: postObject.location,
            likes: likes.likes,
            liked: likes.isLiked,
            comments: comments
        }
    }

    private async getRandomPosts(req: express.Request, res: express.Response) {
        let shownIds: number[] = req.cookies.shown_post_ids
        if (!req.cookies.shown_post_ids) {
            shownIds = []
        }
        if (!req.query.nr_of_posts){
            res.json({error: "No amount of posts have been specified"})
        }
        const post_count = req.query.nr_of_posts ? parseInt(req.query.nr_of_posts.toString()) : 0;
        const postIds = await this.db.fetchRandomPosts(post_count, shownIds)

        const processedPosts: (Post | undefined)[] = await Promise.all(postIds.map(async (id: number) => {
            // @ts-ignore
            return await this.fetchPost(id, req.userId).then((val: Post) => {
                shownIds.push(id)
                return val
            }).catch((err: string) => {
                console.log(err)
                return undefined
            })
        }))

        res.cookie("shown_post_ids", shownIds)
        res.json({
            posts: processedPosts.filter((val: Post | undefined) => val !== undefined),
        });
    }

    private async getRandomFollowerPosts(req, res) {
        let shownIds: number[] = req.cookies.shown_post_ids || [];
        const user_id = req.user.user_id;
    
        if (!req.query.nr_of_posts) {
            return res.json({ error: "No amount of posts have been specified" });
        }
    
        const postCount = parseInt(req.query.nr_of_posts.toString());
        try {
            const user_follower_list = await this.db.fetchUserFollowers(user_id);
                if (user_follower_list.length === 0) {
                return res.json({ posts: [] });
            }
            const random_post_ids = await this.db.fetchRandomsPostsOfGivenUsers(postCount, shownIds, user_follower_list);
                if (random_post_ids.length === 0) {
                return res.json({ posts: [] });
            }
            const processedPosts: (Post | undefined)[] = await Promise.all(
                random_post_ids.map(async (id: number) => {
                    return await this.fetchPost(id, user_id)
                        .then((val: Post) => {
                            shownIds.push(id);
                            return val;
                        })
                        .catch((err: string) => {
                            console.log(err);
                            return undefined;
                        });
                })
            );
    
            res.cookie("shown_post_ids", shownIds);
    
            res.json({
                posts: processedPosts.filter((val: Post | undefined) => val !== undefined),
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    
    private async getPostComments(req: express.Request, res: express.Response) {
        if (!req.query.post_id) {
            res.json({
                redirect: '/pageNotFound'
            });
            return;
        }
        const post_id = parseInt(req.query.post_id.toString());

        const posts = await this.db.fetchPostsByIds([post_id])
        if (posts.length === 0) {
            res.json({
                redirect: '/pageNotFound'
            });
        } else {
            const postObject = posts[0]
            const commentIds = (await this.db.fetchCommentsOfPost(postObject.post_id)).map(comment => comment.comment_id)
            const comment_list: any[] = await Promise.all(commentIds.map(async (comment_id: number) => {
        
                const comments = await this.db.fetchCommentByIds([comment_id])
                const commentObject = comments[0]
                const commentOwner = await this.db.fetchUserUsingID(commentObject.user_id);
                const commentOwnerDecoration = await this.db.fetchProfileDecoration(commentObject.user_id);
                    return {
                    user_id: commentObject.user_id,
                    user: commentOwner[0].username,
                    post_id: commentObject.post_id,
                    description: commentObject.description
                };
            }));
            res.json({
                post_comments: comment_list
            })
        }
    }

    private async getPostLikesAmount(req: express.Request, res: express.Response) {
        try {
            if (!req.query.post_id) {
                res.json({
                    redirect: '/pageNotFound'
                });
                return;
            }
            const post_id = parseInt(req.query.post_id.toString());
            const user_ids = await this.db.fetchLikedUsersOfPost(post_id)

            res.json({
                nr_of_likes: user_ids.length
            });
        } catch (error){
            res.status(400).send(error)
        }
    }

    private async getTagPosts(req: express.Request, res: express.Response) {
        if (!req.query.tags || !req.query.longitude || !req.query.latitude
            || !req.query.radius || !req.query.filter_enabled) {
            return res.status(404).send("One or more parameters missing.")
        }
        const tags: string[] = (req.query.tags as string[]).map(tag => tag.toString());
        const long = parseFloat(req.query.longitude.toString());
        const lat = parseFloat(req.query.latitude.toString());
        const radius = parseInt(req.query.radius.toString());
        const filterEnabled = req.query.filter_enabled;
        let post_list: Post[] = [];

        try {
            if (filterEnabled === 'true') {
                const posts = await Promise.all(
                    tags.map(tag => this.db.fetchPostsByTagWithinRadius(tag, lat, long, radius))
                );
                const uniquePosts = this.removeDuplicates(posts.flat());
                post_list = await Promise.all(uniquePosts.map(async (postObject) => {
                    const post_id = postObject.post_id;
                    const user_id = postObject.user_id;
                    return await this.fetchPost(post_id, user_id);
                }));
            } else if (filterEnabled === 'false') {
                const posts = await Promise.all(
                    tags.map(tag => this.db.fetchPostsByTag(tag))
                );
                const uniquePosts = this.removeDuplicates(posts.flat());
                post_list = await Promise.all(uniquePosts.map(async (postObject) => {
                    const post_id = postObject.post_id;
                    const user_id = postObject.user_id;
                    return await this.fetchPost(post_id, user_id);
                }));
            } else {
                return res.status(404).send("filter_enabled was neither true nor false.");
            }

            post_list = this.shuffleArray(post_list);
            res.json({
                posts: post_list
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                posts: []
            });
        }
    }

    
    private async getFollowerAndTagPosts(req, res) {
        if (!req.query.tags || !req.query.longitude || !req.query.latitude 
            || !req.query.radius || !req.query.filter_enabled) {
            return res.status(404).send("One or more parameters missing.");
        }
    
        const tags: string[] = (req.query.tags as string[]).map(tag => tag.toString());
        const long = parseFloat(req.query.longitude.toString());
        const lat = parseFloat(req.query.latitude.toString());
        const radius = parseInt(req.query.radius.toString());
        const filterEnabled = req.query.filter_enabled;
        const userId = req.user.user_id;
    
        let post_list: Post[] = [];
    
        try {
            const followedList = await this.db.fetchUserFollowed(userId);
    
            if (followedList.length === 0) {
                return res.json({ posts: [] });
            }
    
            if (filterEnabled === 'true') {
                const posts = await Promise.all(
                    tags.map(tag => 
                        this.db.fetchPostsByTagWithinRadiusGivenUsers(tag, lat, long, radius, followedList)
                    )
                );
                const uniquePosts = this.removeDuplicates(posts.flat());
                post_list = await Promise.all(uniquePosts.map(async (postObject) => {
                    const post_id = postObject.post_id;
                    const user_id = postObject.user_id;
                    return await this.fetchPost(post_id, user_id);
                }));
            } else if (filterEnabled === 'false') {
                const posts = await Promise.all(
                    tags.map(tag => this.db.fetchPostsByTagOfGivenUsers(tag, followedList))
                );
                const uniquePosts = this.removeDuplicates(posts.flat());
                post_list = await Promise.all(uniquePosts.map(async (postObject) => {
                    const post_id = postObject.post_id;
                    const user_id = postObject.user_id;
                    return await this.fetchPost(post_id, user_id);
                }));
            } else {
                return res.status(404).send("filter_enabled was neither true nor false.");
            }
    
            post_list = this.shuffleArray(post_list);
            res.json({
                posts: post_list
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                posts: []
            });
        }
    }
    
    private removeDuplicates(posts: any[]): any[] {
        const seen = new Set();
        return posts.filter(post => {
            if (seen.has(post.post_id)) {
                return false;
            } else {
                seen.add(post.post_id);
                return true;
            }
        });
    }
    private shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    private async getNearestPosts(req: express.Request, res: express.Response) {
        try {
            if (!req.query.longitude || !req.query.latitude  || !req.query.limit) {
                return res.json({
                    redirect: '/pageNotFound'
                });
            }
            const long = parseInt(req.query.longitude.toString());
            const lat = parseInt(req.query.latitude.toString());
            const limit = parseInt(req.query.limit.toString());

            const posts = await this.db.fetchNearestPosts(lat, long, limit)
            const post_list = await Promise.all(posts.map(async (postObject) => {
                const post_id = postObject.post_id;
                const user_id = postObject.user_id;
                return await this.fetchPost(post_id, user_id);
            }))
            res.json({
                posts: post_list
            })
        } catch (error){
            res.status(400).send(error)
        }
    }

    private async getPostsWithinRadius(req: express.Request, res: express.Response) {
        try {
            if (!req.query.longitude || !req.query.latitude  || !req.query.radius || !req.query.limit) {
                return res.json({
                    redirect: '/pageNotFound'
                });
            }
            const long = parseInt(req.query.longitude.toString());
            const lat = parseInt(req.query.latitude.toString());
            const radius = parseInt(req.query.radius.toString())
            const limit = parseInt(req.query.limit.toString());

            let post_list: any[] = []
            if (limit == -1) {
                const posts = await this.db.fetchPostsWithinRadius(lat, long, radius)
                post_list = await Promise.all(posts.map(async (postObject) => {
                    const post_id = postObject.post_id;
                    const user_id = postObject.user_id;
                    return await this.fetchPost(post_id, user_id);
                }))
            } else {
                const posts = await this.db.fetchPostsWithinRadiusWithLimit(lat, long, radius, limit)
                post_list = await Promise.all(posts.map(async (postObject) => {
                    const post_id = postObject.post_id;
                    const user_id = postObject.user_id;
                    return await this.fetchPost(post_id, user_id);
                }))
            }
            res.json({
                posts: post_list
            })
        } catch (error){
            res.status(400).send(error)
        }

    }

    private async isPostLiked(req: express.Request, res: express.Response){
        if (!req.query.post_id) {
            res.json({
                redirect: '/pageNotFound'
            });
            return;
        }
        // @ts-ignore
        const user_id = req.userId;
        if (user_id !== -1) {
            const post_id = parseInt(req.query.post_id.toString());
            let likedPostsOfUser: number[] = (await this.db.fetchLikedPostsOfUser(user_id))
                .map((post) => {
                    return post.post_id
                })
            return res.json({
                liked: likedPostsOfUser.includes(post_id)
            });
        } else {
            res.json({
                liked: false
            });
        }
    }
}



