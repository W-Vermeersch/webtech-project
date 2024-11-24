import { Pool } from 'pg';

class Database {
    pool = new Pool({
        host: "localhost",  //location of the database, here localhost because we don't have any servers
        user: "postgres",
        port: 5432,   //default port for postgresql
        password: "webtech",
        database: "Animal_GO_Database", //name of postgresql databse
        max: 10, //maximum amount of clients in the pool
        idleTimeout: 60000   //close idle clients after 1 minute
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
        id: number,
        password: string
    ) {
        console.log("Storing user.");
        const query = {
            text: 'INSERT INTO user_table (username, first_name, last_name, email, password, id) VALUES ($1, $2, $3, $4, $5, $6)',
            values: [username, first_name, last_name, email, password, id],
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
    public async storePost(post_title: string,
                           image_url: string[],
                           description: string,
                           tags: string[],
                           likes: string[],
                           latitude: number,
                           longitude: number): Promise<void> {
        const query = {
            text: 'INSERT INTO post_table (post_title, image_url, description, tags, likes, location) VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326))',
            values: [post_title, image_url, description, tags, likes, longitude, latitude],
        };
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

    closePool(): any {
        this.pool.end();
        console.log("Database pool has been closed.");
    }
}

export default Database;

