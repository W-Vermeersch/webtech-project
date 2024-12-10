import * as express from 'express';
import * as session from 'express-session';
import { BaseController,LogInController, SignInController, PostController } from './controllers';
import * as path from 'path';
import cors = require("cors");
import Database from "./database";
import { CreatePostController} from './controllers/post/create-post.controllers';
import { UserProfileController } from './controllers/user-profile.controllers';
const swaggerUi = require('swagger-ui-express') ;
const swaggerDocument = require('./swagger.json');

export class App {
    app: express.Application;
    port: number = 5000;
    controllers: Map<string, BaseController> = new Map();
    path: string = "";

    database: Database =  new Database();


    constructor() {
        this.app = express();

        this._initializeMiddleware();
        this._initializeControllers();
        this.listen();
        this._handleShutdown();
    }

    private _initializeControllers(): void {
        // Add new controllers here
        this.addController(new SignInController(this.database));
        this.addController(new PostController(this.database));
        this.addController(new LogInController(this.database));
        this.addController(new CreatePostController());
        this.addController(new UserProfileController());
        // We link the router of each controller to our server
        this.controllers.forEach(controller => {
            this.app.use(`${this.path}${controller.path}`, controller.router);
        });
    }

    public addController(controller: BaseController): void {
        this.controllers.set(controller.constructor.name, controller);
    }

    private _initializeMiddleware(): void {
        this.app.set('view engine', 'ejs');
        //this.app.use(session({
        //    secret: 'Maxim',
        //    resave: true,
        //    saveUninitialized: true
        //}));
        this.app.use(cors());

        this.app.use(express.json({ limit: "150mb" }));
        this.app.use(express.urlencoded({ limit: "150mb", extended: true }));
        this.app.use(express.static(path.join(__dirname, "../static")));

        this.database.init()
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on http://localhost:${this.port}`);
        });
    }

    private _handleShutdown(): void {
        const shutdown = async () => {
            console.log('Shutting down the server');
            try {
                await this.database.closePool();
            } catch (err) {
                console.error('Error shutting down the database pool:', err);
            } finally {
                process.exit(0);
            }
        };
        // Handle shutdown signals
        process.on('SIGINT', shutdown);  //Ensures the database connection pool closes when terminating the server.
    }


}
export default new App();