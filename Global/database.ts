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
        await this.executeQuery(query); // Use await to handle the promise
    }

    public async fetchUser(username: string, id: number) {
        console.log("Fetching user.");
        const query = {
            text: 'SELECT * FROM user_table WHERE username = $1 AND id = $2',
            values: [username, id],
            rowMode: 'array',  //means it will return an array of values instead of a javascript object
        }
        const res = await this.executeQuery(query);
        console.log(res.rows);
        return res.rows; // resulting array contains a lot of query metadata.
                         // ".rows" will make it return only the values of each attribute (username, first_name, etc.)
    };                   // if you need that metadata you can remove .rows and extract what you need.

    closePool(): any {
        this.pool.end();
        console.log("Database pool has been closed.");
    }
}

export default Database;

