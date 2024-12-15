import * as express from "express";
import {BaseDatabaseController} from "../base.database.controller";
import Database from "../../../database";
import {ifAuthenticatedToken} from "../../user-authentification";

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
        Longitude: Number
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

        this.router.get("/fetch/tag/posts", ifAuthenticatedToken, (req: express.Request, response: express.Response) => {
            return this.getTagPosts(req, response);
        });

    }

    private async processLikesOfPost(post_id: number, user_id: number): Promise<{ isLiked: boolean, likes: number }> {
        return await this.db.fetchLikedUsersOfPost(post_id).then((res) => {
            const resp = {isLiked: false, likes: 0}
            console.log("User who liked : ", user_id)
            if (res.includes(user_id)) {
                resp.isLiked = true;
            }
            resp.likes = res.length;
            console.log("Found post : ", resp);
            return resp;
        })
    }

    private async getPostInformation(req: express.Request, res: express.Response) {
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
        const postOwner = await this.db.fetchUserUsingID(postObject.user_id)
        console.log("Post owner: ", postOwner);
        const postOwnerDecoration = await this.db.fetchProfileDecoration(postObject.user_id);
        const likes = await this.processLikesOfPost(postId, userId);
        const comments = await this.fetchComments(postId);
        return {
            idx: postId,
            user: postOwner[0].username,
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
        // const shownIds: number[] = req.cookies.shown_post_ids//.split(',').filter((i) => +i);
        console.log(shownIds);
        if (!req.query.nr_of_posts){
            res.json({error: "No amount of posts have been specified"})
        }
        console.log("getRandomPosts called")
        const post_count = req.query.nr_of_posts ? parseInt(req.query.nr_of_posts.toString()) : 0;
        const postIds = await this.db.fetchRandomPosts(post_count, shownIds) 
        console.log("postIds: "+ postIds)

        const processedPosts: (Post | undefined)[] = await Promise.all(postIds.map(async (id: number) => {
            // @ts-ignore
            return await this.fetchPost(id, req.query.userId).then((val: Post) => {
                shownIds.push(id)
                // console.log(val)
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
            const commentIds = await (await this.db.fetchCommentsOfPost(postObject.post_id)).map(comment => comment.comment_id)
            const comment_list: any[] = await Promise.all(commentIds.map(async (comment_id: number) => {
        
                const comments = await this.db.fetchCommentByIds([comment_id])
                const commentObject = comments[0]
                const commentOwner = await this.db.fetchUserUsingID(commentObject.user_id);
                const commentOwnerDecoration = await this.db.fetchProfileDecoration(commentObject.user_id);
                    return {
                    user_id: commentObject.user_id,
                    user: commentOwner[0].username,
                    profile_picture: commentOwnerDecoration.profilePicture,
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
        }


        private async getTagPosts(req: express.Request, res: express.Response) {
            if (!req.query.tag) {
                return res.json({
                    redirect: '/pageNotFound'
                });
            }
            const tag = req.query.tag;
            const posts = await this.db.fetchPostsByTag(tag.toString())
            const post_list = await Promise.all(posts.map(async (postObject) => {
                const post_id = postObject.post_id;
                const user_id = postObject.user_id;
                return await this.fetchPost(post_id, user_id);
            }))
            res.json({
                posts: post_list
            })
        }
}



