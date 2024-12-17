import { Pool } from 'pg';
import {Like} from "../Global/post";
// import {User} from "./Modules/User";
require('dotenv').config();
import { User, Post, Comment, UserDecoration} from "./interfaces"

interface QueryWithoutValues {
    text: string;
}
interface QueryWithValues extends QueryWithoutValues {
    values: any[]
}

class Database {
    pool = new Pool({
        host: "pg-14b692ff-webtech.b.aivencloud.com",  //location of the database, here localhost because we don't have any servers
        user: "avnadmin",
        port: 15545,   //default port for postgresql
        password: process.env.DB_PASSWORD,
        database: "defaultdb", //name of postgresql database
        max: 10, //maximum amount of clients in the pool
        idleTimeout: 60000,   //close idle clients after 1 minute
        ssl: {
            rejectUnauthorized: true,
            ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUHnlWqW1FQc9NKcdf8w4sMsEvZQAwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYmJiMmMxN2MtYjk3Yy00MzdmLWJkYmMtMGRmM2NiYjdh
YzczIFByb2plY3QgQ0EwHhcNMjQxMTI1MTYyMjM1WhcNMzQxMTIzMTYyMjM1WjA6
MTgwNgYDVQQDDC9iYmIyYzE3Yy1iOTdjLTQzN2YtYmRiYy0wZGYzY2JiN2FjNzMg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMdUD0Yw
1jMxrbRKBp2c07qOi/3m/zBhS3cA7sYhqcYaYNbb75JA1VtQbkitqOskFoCmB2Nl
BD3Pz0FmIcS8gF98B3rs92lHLBqyEV64uBdCwz4MZC7+09UkoU6vYzxyGK5HvBrp
HXDWBO9Kr6C2yuK0Pyo8IvVZ7DOhOo7XWB++LpkxIGU+7j4S6e0Qi/wm+Mwm9ied
bKrdMruFruQvF7eQXTI4Bx5HBmC2r8WF80L8cz5O9OBTzsFoqIRPyxeVcwuJ5BCf
coEK2Pb3YIcLV1uZk9Y6xCXJ3NAnvoLedYzvygTa3kDlV141osUjU9j5Qily2VPa
tvl92YQAuSFLsFeFARQ0WYwYJIhMAkaTSmAX/oNNr3jYvk8VC8PIH8b5ClsDH6ta
Sm9ZGxWVIthUJlqxU/7nsmG7l0FnLJ46bTHWjxXdtEY9QVTG2MetHA3QLQaOrC7s
AHzvG1JFHovRrzvygt64e1VAlGsAr2RU048NWzdmY9d9JW3qYn0bFQ2ZRwIDAQAB
oz8wPTAdBgNVHQ4EFgQUz/4E0crCMtdRnx8e/C0LVmWS2PQwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAE59NmXI9ge3lLgU
3GVbzMENPLl71rO0b+try8V2C5q0UE4/tYxCU6vMY3UK5lzUiX4rtZcN93y6xZPs
6RZqgt0u818wkShWiU3mPSqabYAUL8d9DRtYld6URxqV7VSAri+akW7u/pomBZAy
Lwv6IR2kMZyuxRCkzTp8ASy+V1qJzRSU3ms6za/RR8ARNeRHbyZcMgLSYwSJ4heF
hP/7fOtF/iUs+YPXpDxXMicaJBtvdWmnDrcWMhzual1Lc0TX5QQdmu8lXe0UnRbU
XcZF/nSjadV1loVCMqOF/5NCjZi2S+4SyqR4B7kUWBdGNAu/b1sB7LvGpasx1NlF
PTLjeEfhdEDZ2LeqlZSCD2pJCUle/49nkPD8QYW4GKUlAEkHuU42oFBDABiK5/gu
O3AUz7xTGi1NI83iJzbScoDeSDALFpkbVyc8o0WOfZXV/mNR47UASIydJjjm+Q5D
RkwtpUvpWigegy483OMPpbmlNj2F0r5l7w/f5ZwJCNcAtbd3bw==
-----END CERTIFICATE-----`,
        },
    });

    private executeQuery(query: QueryWithoutValues | QueryWithValues): Promise<any> {
        try {
            return this.pool.query(query);  // Automatically acquires and releases client
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    };

    //Operations for the user table:
    /* Stores a user into the DB.*/
    public async storeUser(user: User) {
        const query = {
            text: 'INSERT INTO user_table (username, email, password) VALUES ($1, $2, $3)',
            values: [user.username, user.email, user.password],
        };
        return this.executeQuery(query).catch(console.error);
    }
    /* Returns an array with all the column values of a user given their username.*/
    public async fetchUserUsingUsername(username: string): Promise<User[]> {
        const query = {
            text: 'SELECT * FROM user_table WHERE username = $1',
            values: [username],
        }
        return this.executeQuery(query).then((res) => {return res.rows});
        // resulting array contains a lot of query metadata.
        // ".rows" will make it return only the values of each attribute (username, first_name, etc.)
        // if you need that metadata you can remove .rows and extract what you need.
    };

    public async fetchUsersMatchingSearch(searchQuery: string) {
        const query = {
            text: `
                SELECT *, similarity(username, $1) AS similarity_score
                FROM user_table
                WHERE username ILIKE '%' || $1 || '%'
                ORDER BY
                    (username = $1) DESC, 
                    similarity_score DESC; 
            `,
            values: [searchQuery],
        };
    
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array with all the column values of a user given their ID.*/
    public async fetchUserUsingID(user_id: number) {
        const query = {
            text: 'SELECT * FROM user_table WHERE user_id = $1',
            values: [user_id],
        }
        return await this.executeQuery(query).then((res) => {return res.rows});
    };
    /* Returns an array with all the column values of a user given their email adress OR their username (used for logging in).*/
    public async fetchUserUsingEmailOrUsername(input: string): Promise<User[]> {
        const query = {
            text: 'SELECT * FROM user_table WHERE email = $1 OR username = $1',
            values: [input],
        };
        return await this.executeQuery(query).then((res) => {return res.rows;});
    }

    /* Returns the ID of a user given their username*/
    public async getUserID(username: string): Promise<number> {
        try {
            return await this.fetchUserUsingUsername(username).then((response)=>{
                return response[0].user_id
            }).catch(() => {
                return 0;
            });
        }
        catch {
            return 0
        }
    };

    /* Deletes a user form the BD given their identifier (username and id). All posts that belong to this user will automatically be deleted as well as its comments and the users comments. */
    public async deleteUser(username: string,
                            user_id: number): Promise<void> {
        const query = {
            text: 'DELETE FROM user_table WHERE username = $1 AND user_id = $2',
            values: [username, user_id],
        };
        return this.executeQuery(query);
    }


    //Operations for the comment table
    /* Stores a comment into the DB, IDs of user and post need to be given */
    public async storeComment(comment: Comment): Promise<void> {
        const query = {
            text: 'INSERT INTO comment_table (post_id, user_id, description) VALUES ($1, $2, $3)',
            values: [comment.post_id, comment.user_id, comment.description],
        };
        return this.executeQuery(query);
    }

    /* Returns an array of all comments that match with the given list of comment IDs. */
    public async fetchCommentByIds(commentIds: number[]): Promise<Comment[]> {
        if (commentIds.length === 0) {
            return [];
        }
        const query = {
            text: 'SELECT * FROM comment_table WHERE comment_id = ANY($1)',
            values: [commentIds],
        };
        return await this.executeQuery(query).then((res) => {return res.rows;});
    }

    /* Returns an array with all the comments of a given post using its ID. */
    public async fetchCommentsOfPost(post_id: number): Promise<Comment[]> {
        const query = {
            text: 'SELECT * FROM comment_table WHERE post_id = $1',
            values: [post_id],
        };
        return await this.executeQuery(query).then((res) => {return res.rows;});
    }

    /* Returns an array with all the comments from a given user given their ID. */
    public async fetchCommentsOfUser(user_id: number): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM comment_table WHERE user_id = $1',
            values: [user_id],
        };
        return await this.executeQuery(query).then((res) => {return res.rows;});
    }

    /* Deletes a comment from the DB given the ID of itself and its user. */
    public async deleteComment(comment_id: number): Promise<void> {
        const query = {
            text: 'DELETE FROM comment_table WHERE comment_id = $1',
            values: [comment_id],
        };
        return await this.executeQuery(query);
    }

    //Operations for the post table
    /* Stores a post into the DB*/
    public async storePost(post: Post): Promise<void> {
        let query: QueryWithValues;
        if (post.location.longitude !== undefined && post.location.latitude !== undefined) {
            // Insert with geospatial data
            query = {
                text: `
                    INSERT INTO post_table
                    (user_id, image_url, description, tags, score, rarity, location)
                    VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326))
                `,
                values: [
                    post.user_id,
                    post.image_url,
                    post.description,
                    post.tags,
                    post.score,
                    post.rarity,
                    post.location.longitude,
                    post.location.latitude,
                ],
            };
        } else {
            // Insert without geospatial data
            query = {
                text: `
                    INSERT INTO post_table
                    (user_id, image_url, description, tags, score, rarity)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `,
                values: [
                    post.user_id,
                    post.image_url,
                    post.description,
                    post.tags,
                    post.score,
                    post.rarity
                ],
            };
        }

        // Execute the query
        return this.executeQuery(query)
            // .then(() => console.log('Post stored successfully.'))
            .catch(error => {
                console.error('Error storing post:', error);
                throw error; // Re-throw the error for upstream handling
            });
    }

    /* Returns an array of all the posts that a user has liked, given their user ID. */
public async fetchLikedPostsOfUser(user_id: number): Promise<Post[]> {
    // return this.executePostQuery(` FROM likes_table l INNER JOIN post_table p ON l.post_id = p.post_id WHERE l.user_id = $1`, [user_id])
    const query = {
        text: `
            SELECT
                p.post_id,
                p.user_id,
                p.image_url,
                p.description,
                p.tags,
                p.score,
                p.rarity,
                ST_X(p.location::geometry) AS longitude,
                ST_Y(p.location::geometry) AS latitude
            FROM likes_table l
            INNER JOIN post_table p ON l.post_id = p.post_id
            WHERE l.user_id = $1
        `,
        values: [user_id],
    };
    return this.executeQuery(query).then((res) => {
        return res.rows.map((row) => ({
            post_id: row.post_id,
            user_id: row.user_id,
            image_url: row.image_url,
            description: row.description,
            tags: row.tags,
            score: row.score,
            rarity: row.rarity,
            location: {
                longitude: row.longitude,
                latitude: row.latitude,
            }
        }));
    });


    }

    public async fetchLikedUsersOfPost(post_id: Number): Promise<number[]> {
        const query = {
            text: 'SELECT user_id FROM likes_table where post_id = $1',
            values: [post_id]
        }
        return await this.executeQuery(query).then((res) => {
            return res.rows.map((user: Like) => user.user_id)
        });
    }

    private async executePostQuery(query_specification: string, values: any): Promise<Post[]> {
    const query = {
        text: `SELECT post_id, user_id, image_url, description, tags, score, rarity, ST_X(location::geometry) AS longitude, ST_Y(location::geometry) AS latitude ${query_specification}`,
        values: [values],
    }
        return this.executeQuery(query).then((res) => {
            return res.rows.map((row) => ({
                post_id: row.post_id,
                user_id: row.user_id,
                image_url: row.image_url,
                description: row.description,
                tags: row.tags,
                score: row.score,
                rarity: row.rarity,
                location: {
                    longitude: row.longitude,
                    latitude: row.latitude,
                }
            }));
        }).catch(err => {
            console.log("Error in q : ",err)
            return []
        });
}

        /* Returns an array of all posts that match with the given list of post IDs. */
    public async fetchPostsByIds(postIds: number[]): Promise<Post[]> {
        if (postIds.length === 0) {
            return [];
        }
        return this.executePostQuery(` FROM post_table WHERE post_id = ANY($1)`, postIds)
    }

    /* Returns an array with all the posts made by a user given their ID. */
    public async fetchPostsOfUser(user_id: number): Promise<Post[]> {
        return this.executePostQuery(`FROM post_table WHERE user_id = $1`, user_id)
    }

    /* Fetch posts within a radius */
    public async fetchPostsWithinRadius(latitude: number, longitude: number, radius: number): Promise<any[]> {
        const query = {
            text: `
                SELECT 
                    post_id, 
                    user_id, 
                FROM post_table 
                WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
            `,
            values: [longitude, latitude, radius],
        };
        const res = await this.executeQuery(query)
        return res.rows
    }

    public async fetchPostsWithinRadiusWithLimit(latitude: number, longitude: number, radius: number, limit: number): Promise<Post[]> {
        const query = {
            text: `
                SELECT 
                    post_id, 
                    user_id, 
                FROM post_table 
                WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
                LIMIT $4
            `,
            values: [longitude, latitude, radius, limit],
        };
        return this.executeQuery(query).then(list => {
            return list.rows.map((val) => {
                return {

                }
                })})
    }

    /* Fetch nearest posts */
    public async fetchNearestPosts(latitude: number, longitude: number, limit: number): Promise<any[]> {
        const query = {
            text: `
                SELECT 
                    post_id, 
                    user_id, 
                FROM post_table 
                ORDER BY ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) 
                LIMIT $3
            `,
            values: [longitude, latitude, limit],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    //post id 16 is giving bugs because it is linked to someone without a decoration, remove this later
    public async fetchRandomPosts(n: Number, shownPosts) {
        const query = {
            text: `SELECT 
                    post_id
                    FROM post_table
                    WHERE post_id NOT IN (SELECT post_id FROM post_table WHERE post_id = ANY($1::int[])) 
                    ORDER BY RANDOM()
                    LIMIT $2;
                    `,
            values: [shownPosts, n]
        }
        const res = await this.executeQuery(query);
        return res.rows.map(post => post.post_id);
    }

    public async fetchPostsByTag(tag: string): Promise<{ post_id: number, user_id: number }[]> {
        const query = {
            text: `
                SELECT
                    post_id,
                    user_id
                FROM post_table
                WHERE
                    EXISTS (
                        SELECT 1
                        FROM unnest(tags) AS tag_element
                        WHERE tag_element ILIKE $1
                    );
            `,
            values: [tag],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    public async fetchPostsByTagWithinRadius(tag: string, latitude: number, longitude: number, radius: number): Promise<any[]> {
        const query = {
            text: `
                SELECT
                    post_id,
                    user_id
                FROM post_table
                WHERE 
                    EXISTS (
                        SELECT 1
                        FROM unnest(tags) AS tag_element
                        WHERE tag_element ILIKE $1
                    )
                    AND ST_DWithin(
                        ST_Transform(location::geometry, 3857),  
                        ST_Transform(ST_SetSRID(ST_MakePoint($2, $3), 4326), 3857), 
                        $4  -- Radius in meters
                    );
            `,
            values: [tag, longitude, latitude, radius],
        };
    
        const res = await this.executeQuery(query);
        return res.rows;
    }
    
    

    /* Deletes a post from the DB given its ID. All comments that belong to this post will automatically be deleted as well. */
    public async deletePost(post_id: number): Promise<void> {
        const query = {
            text: 'DELETE FROM post_table WHERE post_id = $1',
            values: [post_id],
        };
        return await this.executeQuery(query);
    }


    //profile decoration operations

    public async storeProfileDecoration(
        user: User,
        bio: string,
    ) {
        const query = {
            text: 'INSERT INTO user_profile_decoration_table (user_id, display_name, bio, profile_picture_image_url, total_exp, badges) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [user.user_id, user.username, bio, "/src/assets/default-profile-picture.jpg", 0, []],
        };
        return await this.executeQuery(query);
    }

    /*Update a user's profile picture given their ID*/
    public async updateProfilePicture(user_id: number, newImageUrl: string): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET profile_picture_image_url = $1 WHERE user_id = $2',
            values: [newImageUrl, user_id],
        };
        return await this.executeQuery(query);
    }

    /*Update the total EXP count of a user given their ID*/
    public async addUserExp(user_id: number, newExp: number): Promise<void> {
        try {

            const query = {
                text: 'UPDATE user_profile_decoration_table SET total_exp =  total_exp + $1 WHERE user_id = $2',
                values: [Math.trunc(newExp), user_id],
            };
            return await this.executeQuery(query);
        }
        catch (error) {
            console.error(error);
        }
    }

    /*Updates a user's badge list (replaces the entire list)*/
    public async updateBadges(user_id: number, newBadges: string[]): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET badges = $1 WHERE user_id = $2',
            values: [JSON.stringify(newBadges), user_id],
        };
        return await this.executeQuery(query);
    }
    /*Updates a user's bio description*/
    public async updateBio(user_id: number, newBio: string): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET bio = $1 WHERE user_id = $2',
            values: [newBio, user_id],
        };
        return await this.executeQuery(query);
    }
    public async updateDisplayName(user_id: number, newName: string): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET display_name = $1 WHERE user_id = $2',
            values: [newName, user_id],
        };
        return await this.executeQuery(query);
    }

    public async fetchProfileDecoration(user_id: number): Promise<UserDecoration> {
        const query = {
            text: 'SELECT * FROM user_profile_decoration_table WHERE user_id = $1',
            values: [user_id],
        };
        return this.executeQuery(query).then( value => {
            const val = value.rows[0];
            return {
                userId: val.user_id,
                name: val.display_name,
                bio: val.bio,
                profilePicture: val.profile_picture_image_url,
                xp: val.total_exp,
                badges: val.badges,
            }
        });
    }

    public async deleteUserDecoration(user_id: number) {
        const query = {
            text: 'DELETE FROM user_profile_decoration_table WHERE user_id = $1',
            values: [user_id],
        };
        return await this.executeQuery(query);
    }


    public async storeLike(
        user_id: number,
        post_id: number,
    ) {
        const query = {
            text: 'INSERT INTO likes_table (user_id, post_id) VALUES ($1, $2)',
            values: [user_id, post_id],
        };
        return await this.executeQuery(query);
    }

    public async deleteLike(user_id: number,
                            post_id: number): Promise<void> {
        const query = {
            text: 'DELETE FROM likes_table WHERE user_id = $1 AND post_id = $2',
            values: [user_id, post_id],
        };
        return await this.executeQuery(query);
    }


    public async fetchTopTen() {
        const query = {
            text: ` WITH RankedUsers AS (
                        SELECT 
                            user_id,
                            total_exp AS totalexp,
                            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total_exp DESC) AS rank
                        FROM user_profile_decoration_table
                    )               
                    SELECT 
                        user_id,
                        totalexp
                    FROM RankedUsers
                    WHERE rank = 1
                    ORDER BY totalexp DESC
                    LIMIT 10;
                    `,
        }
        const res =  await this.executeQuery(query)
        return res.rows
    }


    public async followUser(follower_id: number, followed_id: number): Promise<void> {
        const query = {
            text: 'INSERT INTO follower_table (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            values: [follower_id, followed_id],
        };
        return await this.executeQuery(query);
    }
    
    public async unfollowUser(follower_id: number, followed_id: number): Promise<void> {
        const query = {
            text: 'DELETE FROM follower_table WHERE follower_id = $1 AND followed_id = $2',
            values: [follower_id, followed_id],
        };
        return await this.executeQuery(query);
    }
    
    public async fetchUserFollowers(user_id: number): Promise<number[]> {
        const query = {
            text: 'SELECT follower_id FROM follower_table WHERE followed_id = $1',
            values: [user_id],
        };
        const result = await this.executeQuery(query);
        return result.rows.map(row => row.follower_id);
    }
    
    public async fetchUserFollowed(user_id: number): Promise<number[]> {
        const query = {
            text: 'SELECT followed_id FROM follower_table WHERE follower_id = $1',
            values: [user_id],
        };
        const result = await this.executeQuery(query);
        return result.rows.map(row => row.followed_id);
    }
    
    public async fetchRandomsPostsOfGivenUsers(n: number, shownPosts: number[], userIds: number[]): Promise<number[]> {
        const query = {
            text: `
                SELECT 
                    post_id
                FROM post_table
                WHERE 
                    post_id NOT IN (SELECT post_id FROM post_table WHERE post_id = ANY($1::int[])) 
                    AND user_id = ANY($2::int[])
                ORDER BY RANDOM()
                LIMIT $3;
            `,
            values: [shownPosts, userIds, n]
        };
        const res = await this.executeQuery(query);
        return res.rows.map(post => post.post_id);
    }


    public async fetchPostsByTagOfGivenUsers(tag: string, userIds: number[]): Promise<{ post_id: number, user_id: number }[]> {
        const query = {
            text: `
                SELECT
                    post_id,
                    user_id
                FROM post_table
                WHERE
                    EXISTS (
                        SELECT 1
                        FROM unnest(tags) AS tag_element
                        WHERE tag_element ILIKE $1
                    )
                    AND user_id = ANY($2::int[]);
            `,
            values: [tag, userIds],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    public async fetchPostsByTagWithinRadiusGivenUsers(
        tag: string, 
        latitude: number, 
        longitude: number, 
        radius: number, 
        user_ids: number[]
    ): Promise<{ post_id: number, user_id: number }[]> {
        const query = {
            text: `
                SELECT
                    post_id,
                    user_id
                FROM post_table
                WHERE
                    EXISTS (
                        SELECT 1
                        FROM unnest(tags) AS tag_element
                        WHERE tag_element ILIKE $1
                    )
                    AND user_id = ANY($5::int[])
                    AND ST_DWithin(
                        ST_Transform(location::geometry, 3857),
                        ST_Transform(ST_SetSRID(ST_MakePoint($2, $3), 4326), 3857),
                        $4
                    );
            `,
            values: [tag, longitude, latitude, radius, user_ids],
        };
    
        const res = await this.executeQuery(query);
        return res.rows;
    }
    

    public async init(): Promise<void> {
        // Adding the extensions to the DB
        let query = {
            text: 'CREATE EXTENSION IF NOT EXISTS postgis;'
        };
        await this.executeQuery(query);

        query = {
            text: 'CREATE EXTENSION IF NOT EXISTS pg_trgm;'
        };
        await this.executeQuery(query)

        // Create Table for Users
        query = {
            text: 'CREATE TABLE IF NOT EXISTS user_table (user_id SERIAL PRIMARY KEY,username VARCHAR(255) NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL);',
        };
        await this.executeQuery(query);

        // Create Table for Posts
        query = {
            text: 'CREATE TABLE IF NOT EXISTS post_table (post_id SERIAL PRIMARY KEY,user_id INT NOT NULL,image_url TEXT[],description TEXT,tags TEXT[], score INT NOT NULL DEFAULT 0, rarity NUMERIC(2, 1) NOT NULL DEFAULT 0,location GEOGRAPHY(POINT, 4326),FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE);',
        };
        await this.executeQuery(query);

        // Create Table for Comments
        query = {
            text: 'CREATE TABLE IF NOT EXISTS comment_table (comment_id SERIAL PRIMARY KEY,post_id INT NOT NULL,user_id INT NOT NULL,description TEXT NOT NULL,FOREIGN KEY (post_id) REFERENCES post_table(post_id) ON DELETE CASCADE,FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE);',
        };
        await this.executeQuery(query);

        // Create Table for Likes
        query = {
            text: 'CREATE TABLE IF NOT EXISTS likes_table (post_id INT NOT NULL,user_id INT NOT NULL,FOREIGN KEY (post_id) REFERENCES post_table(post_id) ON DELETE CASCADE,FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE);',
        };
        await this.executeQuery(query);

        // Create Table for user decoration
        query = {
            text: 'CREATE TABLE IF NOT EXISTS user_profile_decoration_table (user_id INT NOT NULL,display_name TEXT NOT NULL,bio TEXT,profile_picture_image_url TEXT,total_exp INT NOT NULL DEFAULT 0, badges TEXT[],FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE);',
        };
        await this.executeQuery(query);

        query = {
            // if A follows B, A is the follower and B is the followed
            text: 'CREATE TABLE IF NOT EXISTS follower_table (follower_id INT NOT NULL,followed_id INT NOT NULL,FOREIGN KEY (follower_id) REFERENCES user_table(user_id) ON DELETE CASCADE,FOREIGN KEY (followed_id) REFERENCES user_table(user_id) ON DELETE CASCADE);',
        };
        await this.executeQuery(query);
    }

    closePool(): any {
        this.pool.end();
        console.log("Database pool has been closed.");
    }
}

export default Database;

