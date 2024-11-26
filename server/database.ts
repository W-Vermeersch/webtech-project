import { Pool } from 'pg';
import {Post} from "../Global/post";

class Database {
    pool = new Pool({
        host: "pg-14b692ff-webtech.b.aivencloud.com",  //location of the database, here localhost because we don't have any servers
        user: "avnadmin",
        port: 15545,   //default port for postgresql
        password: "AVNS_fBxdMHN8jb4EYdOS0ir",
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
    /* Stores a user into the BD.*/
    public async storeUser(
        username: string,
        first_name: string,
        last_name: string,
        email: string,
        password: string
    ) {
        console.log("Storing user.");
        const query = {
            text: 'INSERT INTO user_table (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
            values: [username, first_name, last_name, email, password],
        };
        await this.executeQuery(query);
    }
    /* Returns an array with all the column values of a user given their identifiers (username and id).*/
    public async fetchUser(username: string,
                           id: number): Promise<any> {
        console.log("Fetching user.");
        const query = {
            text: 'SELECT * FROM user_table WHERE username = $1 AND id = $2',
            values: [username, id],
            rowMode: 'array',
        }
        const res = await this.executeQuery(query);
        console.log(res.rows);
        return res.rows; // resulting array contains a lot of query metadata.
                         // ".rows" will make it return only the values of each attribute (username, first_name, etc.)
    };                   // if you need that metadata you can remove .rows and extract what you need.

    /* Deletes a user form the BD given their identifier (username and id).*/
    public async deleteUser(username: string,
                            id: number): Promise<void> {
        const query = {
            text: 'DELETE FROM user_table WHERE username = $1 AND id = $2',
            values: [username, id],
        };
        await this.executeQuery(query);
    }



    //Operations for the comment table
    /* Stores a comment into the DB, idx must be the same index as the posts index. */
    public async storeComment(idx: number,
                              user: string,
                              comment: string): Promise<void> {
        const query = {
            text: 'INSERT INTO comment_table (idx, username, description) VALUES ($1, $2, $3)',
            values: [idx, user, comment],
        };
        await this.executeQuery(query);
    }

    /* Returns an array with all the comments of a given post using its identifier (idx). */
    public async fetchCommentsOfPost(idx: number): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM comment_table WHERE idx = $1',
            values: [idx],
            rowMode: 'array',
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array with all the comments from a given user given their username. */
    public async fetchCommentsOfUser(user: string): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM comment_table WHERE username = $1',
            values: [user],
            rowMode: 'array',
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Deletes a comment from the DB given its idx and user. */
    public async deleteComment(idx: number,
                               user: string): Promise<void> {
        const query = {
            text: 'DELETE FROM comment_table WHERE idx = $1 AND username = $2',
            values: [idx, user],
        };
        await this.executeQuery(query);
    }



    //Operations for the post table

    //all post fetch functions will return an array of posts.
    //and each post will be an array of all the columns of the post table.
    //so the resulting array will be an array of arrays.

    /* Stores a post into the DB, idx is the post's identifier (auto-incremented). */
    public async storePost(post: Post): Promise<void> {
        let query = {
            text: 'INSERT INTO post_table (post_title, image_url, description, tags, likes, location) VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326))',
            values: [post.title, post.image_url, post.description, post.tags, post.likes, post.longitude, post.latitude],
        };
        if (post.longitude === undefined) {
            query = {
                text: 'INSERT INTO post_table (post_title, image_url, description, tags, likes) VALUES ($1, $2, $3, $4, $5)',
                values: [post.title, post.image_url, post.description, post.tags, post.likes],
            };
        }
        await this.executeQuery(query);
    }

    /* Returns an array with all the posts made by a user given their username. */
    public async fetchPostsOfUser(username: string): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM post_table WHERE username = $1',
            values: [username],
            rowMode: 'array',
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array of posts that a user has liked given their username. */
    public async fetchLikedPostsOfUser(username: string): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM post_table WHERE $1 = ANY(likes)',
            values: [username],
            rowMode: 'array',
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Returns an array of all posts belonging to a tag given the tag's name. */
    public async fetchPostsFromTag(tag: string): Promise<any[]> {
        const query = {
            text: 'SELECT * FROM post_table WHERE $1 = ANY(tags)', // Tag search in the "tags" array.
            values: [tag],
            rowMode: 'array',
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
            rowMode: 'array',
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
            rowMode: 'array',
        };
        const res = await this.executeQuery(query);
        return res.rows;
    }

    /* Deletes a post from the DB given its identifier (idx). All comments that belong to this post will automatically be deleted as well. */
    public async deletePost(idx: number): Promise<void> {
        const query = {
            text: 'DELETE FROM post_table WHERE idx = $1',
            values: [idx],
        };
        await this.executeQuery(query);
    }

    public async init(): Promise<void> {
        let query = {
            text: 'CREATE EXTENSION IF NOT EXISTS postgis;'
        };
        await this.executeQuery(query);
        query = {
            text: 'CREATE TABLE IF NOT EXISTS user_table (id SERIAL PRIMARY KEY,username VARCHAR(255) UNIQUE NOT NULL,first_name VARCHAR(255) NOT NULL,last_name VARCHAR(255) NOT NULL,email VARCHAR(255) UNIQUE NOT NULL,password VARCHAR(255) NOT NULL)',
        };
        await this.executeQuery(query);
        query = {
            text: 'CREATE TABLE IF NOT EXISTS post_table (idx SERIAL PRIMARY KEY,post_title VARCHAR(255) NOT NULL,image_url TEXT[],description TEXT,tags TEXT[],likes TEXT[],location GEOGRAPHY(POINT, 4326))',
        };
        await this.executeQuery(query);
        query = {
            text: 'CREATE TABLE IF NOT EXISTS comment_table (id SERIAL PRIMARY KEY,idx INT NOT NULL,username VARCHAR(255) NOT NULL,description TEXT NOT NULL,FOREIGN KEY (idx) REFERENCES post_table(idx) ON DELETE CASCADE)',
        };
        await this.executeQuery(query);
    }

    closePool(): any {
        this.pool.end();
        console.log("Database pool has been closed.");
    }
}

export default Database;

