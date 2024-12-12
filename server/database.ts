import { Pool } from 'pg';
import {Post} from "../Global/post";
require('dotenv').config();

class Database {
    pool = new Pool({
        host: "pg-14b692ff-webtech.b.aivencloud.com",  //location of the database, here localhost because we don't have any servers
        user: "avnadmin",
        port: 15545,   //default port for postgresql
        password: process.env.DB_PASSWORD,
        database: "defaultdb", //name of postgresql databse
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

    private executeQuery(query) {
        try {
            return this.pool.query(query);  // Automatically acquires and releases client
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    };

    //Operations for the user table:
    /* Stores a user into the DB.*/
    public async storeUser(
        username: string,
        email: string,
        password: string
    ) {
        console.log("Storing user.");
        const query = {
            text: 'INSERT INTO user_table (username, email, password) VALUES ($1, $2, $3)',
            values: [username, email, password],
        };
        await this.executeQuery(query);
    }
    /* Returns an array with all the column values of a user given their username.*/
    public async fetchUserUsingUsername(username: string): Promise<any> {
        console.log("Fetching user.");
        const query = {
            text: 'SELECT * FROM user_table WHERE username = $1',
            values: [username],
        }
        const res = await this.executeQuery(query);
        //console.log(res.rows);
        return res.rows; // resulting array contains a lot of query metadata.
                         // ".rows" will make it return only the values of each attribute (username, first_name, etc.)
    };                   // if you need that metadata you can remove .rows and extract what you need.

    /* Returns an array with all the column values of a user given their ID.*/
    public async fetchUserUsingID(user_id: number): Promise<any> {
        console.log("Fetching user.");
        const query = {
            text: 'SELECT * FROM user_table WHERE user_id = $1',
            values: [user_id],
        }
        const res = await this.executeQuery(query);
        console.log(res.rows);
        return res.rows;
    };
    /* Returns an array with all the column values of a user given their email adress OR their username (used for logging in).*/
    public async fetchUserUsingEmailOrUsername(input: string): Promise<any> {
        const query = {
            text: 'SELECT * FROM user_table WHERE email = $1 OR username = $1',
            values: [input],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns the ID of a user given their username*/
    public async getUserID(username: string): Promise<number> {
        const userInfo = await this.fetchUserUsingUsername(username);
        return userInfo[0].user_id;
    };

    /* Deletes a user form the BD given their identifier (username and id). All posts that belong to this user will automatically be deleted as well as its comments and the users comments. */
    public async deleteUser(username: string,
                            user_id: number): Promise<void> {
        const query = {
            text: 'DELETE FROM user_table WHERE username = $1 AND user_id = $2',
            values: [username, user_id],
        };
        await this.executeQuery(query);
    }


    //Operations for the comment table
    /* Stores a comment into the DB, IDs of user and post need to be given */
    public async storeComment(user_id: number,
                              post_id: number,
                              comment: string): Promise<void> {
        const query = {
            text: 'INSERT INTO comment_table (post_id, user_id, description) VALUES ($1, $2, $3)',
            values: [post_id, user_id, comment],
        };
        await this.executeQuery(query);
    }

    /* Returns an array with all the comments of a given post using its ID. */
    public async fetchCommentsOfPost(post_id: number): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM comment_table WHERE post_id = $1',
            values: [post_id],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array with all the comments from a given user given their ID. */
    public async fetchCommentsOfUser(user_id: number): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM comment_table WHERE user_id = $1',
            values: [user_id],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Deletes a comment from the DB given the ID of itself and its user. */
    public async deleteComment(comment_id: number,
                               user_id: string): Promise<void> {
        const query = {
            text: 'DELETE FROM comment_table WHERE comment_id = $1 AND user_id = $2',
            values: [comment_id, user_id],
        };
        await this.executeQuery(query);
    }



    //Operations for the post table
    /* Stores a post into the DB, ID of the user needs to be given */
    public async storePost(post: Post): Promise<void> {
        try {
            let query;
            if (post.longitude !== undefined && post.latitude !== undefined) {
                // Insert with geospatial data
                query = {
                    text: `
                    INSERT INTO post_table 
                    (user_id, post_title, image_url, description, tags, location) 
                    VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326))
                `,
                    values: [
                        post.user,
                        post.title,
                        post.image_url,
                        post.description,
                        post.tags,
                        post.longitude,
                        post.latitude,
                    ],
                };
            } else {
                // Insert without geospatial data
                query = {
                    text: `
                    INSERT INTO post_table 
                    (user_id, post_title, image_url, description, tags) 
                    VALUES ($1, $2, $3, $4, $5)
                `,
                    values: [
                        post.user,
                        post.title,
                        post.image_url,
                        post.description,
                        post.tags,
                    ],
                };
            }

            // Execute the query
            await this.executeQuery(query);

            console.log('Post stored successfully.');
        } catch (error) {
            console.error('Error storing post:', error);
            throw error; // Re-throw the error for upstream handling
        }
    }

    /* Returns an array with all the posts made by a user given their ID. */
    public async fetchPostsOfUser(user_id: number): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM post_table WHERE user_id = $1',
            values: [user_id],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array of post IDs that a user has liked given their user ID. */
    public async fetchLikedPostsOfUser(user_id: string): Promise<any[]> {
        const query = {
            text: 'SELECT post_id FROM likes_table WHERE user_id = $1',
            values: [user_id],
        };
        const res = await this.executeQuery(query);  //returns a list of post ids, not the actual posts
        return await this.fetchPostsByIds(res.rows);
    }

        /* Returns an array of all posts that match with the given list of post IDs. */
    public async fetchPostsByIds(postIds: number[]): Promise<any[]> {
        if (postIds.length === 0) {
            return []; // giving empty list can cause errors so manually return a empty list in that case
        }
    
        const query = {
            text: 'SELECT * FROM post_table WHERE post_id = ANY($1)',
            values: [postIds], 
        };
        const res = await this.executeQuery(query);
        return res.rows; 
    }

    /* Returns an array of all posts belonging to a tag given the tag's name. */
    public async fetchPostsFromTag(tag: string): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM post_table WHERE $1 = ANY(tags)', // Tag search in the "tags" array.
            values: [tag],
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array of all posts that are within a certain radius in geolocation. */
    public async fetchPostsWithinRadius(latitude: number,
                                        longitude: number,
                                        radius: number): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM post_table WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)',
            values: [longitude, latitude, radius], // radius is in meters
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array of all the nearest posts from the given location, limit is the amount of posts you want to receive. */
    public async fetchNearestPosts(latitude: number,
                                   longitude: number,
                                   limit: number): Promise<any[]> {
        const query = {
            text: `SELECT * FROM post_table ORDER BY ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) LIMIT $3`,
            values: [longitude, latitude, limit], // Limit for the number of nearest posts
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
        await this.executeQuery(query);
    }


    //profile decoration operations

    public async storeProfileDecoration(
        user_id: number,
        displayName: string,
        bio: string,
    ) {
        const query = {
            text: 'INSERT INTO user_profile_decoration_table (user_id, display_name, bio, profile_picture_image_url, total_exp, badges) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [user_id, displayName, bio, "default-profile-picture.jpg", 0, []],
        };
        await this.executeQuery(query);
    }

    /*Update a user's profile picture given their ID*/
    public async updateProfilePicture(user_id: number, newImageUrl: string): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET profile_picture_image_url = $1 WHERE user_id = $2',
            values: [newImageUrl, user_id],
        };
        await this.executeQuery(query);
    }

    /*Update the total EXP count of a user given their ID*/
    public async updateTotalExp(user_id: number, newExp: number): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET total_exp = $1 WHERE user_id = $2',
            values: [newExp, user_id],
        };
        await this.executeQuery(query);
    }

    /*Updates a user's badge list (replaces the entire list)*/
    public async updateBadges(user_id: number, newBadges: string[]): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET badges = $1 WHERE user_id = $2',
            values: [JSON.stringify(newBadges), user_id],
        };
        await this.executeQuery(query);
    }
    /*Updates a user's bio description*/
    public async updateBio(user_id: number, newBio: string): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET bio = $1 WHERE user_id = $2',
            values: [newBio, user_id],
        };
        await this.executeQuery(query);
    }
    public async updateDisplayName(user_id: number, newName: string): Promise<void> {
        const query = {
            text: 'UPDATE user_profile_decoration_table SET display_name = $1 WHERE user_id = $2',
            values: [newName, user_id],
        };
        await this.executeQuery(query);
    }

    public async fetchProfileDecoration(user_id: number): Promise<any> {
        const query = {
            text: 'SELECT * FROM user_profile_decoration_table WHERE user_id = $1',
            values: [user_id],
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

        // Create Table for Users
        query = {
            text: 'CREATE TABLE IF NOT EXISTS user_table (user_id SERIAL PRIMARY KEY,username VARCHAR(255) NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL);',
        };
        await this.executeQuery(query);

        // Create Table for Posts
        query = {
            text: 'CREATE TABLE IF NOT EXISTS post_table (post_id SERIAL PRIMARY KEY,user_id INT NOT NULL,post_title VARCHAR(255) NOT NULL,image_url TEXT[],description TEXT,tags TEXT[],location GEOGRAPHY(POINT, 4326),FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE);',
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
            text: 'CREATE TABLE IF NOT EXISTS user_profile_decoration_table (user_id INT NOT NULL,display_name TEXT NOT NULL,bio TEXT,profile_picture_image_url TEXT,total_exp INT NOT NULL, badges TEXT[],FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE);',
        };
        await this.executeQuery(query);

    }

    closePool(): any {
        this.pool.end();
        console.log("Database pool has been closed.");
    }
}

export default Database;

