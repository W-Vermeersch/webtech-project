import * as express from 'express';
import * as session from 'express-session';
import {
    BaseController,
    LogInController,
    SignInController,
    CreatePostController,
    UserProfileController,
} from './controllers';
import * as path from 'path';
import cors = require("cors");
import Database from "./database";
import {DeleteController} from "./controllers/database/delete/delete.controllers";
import {FetchUserInformationController} from "./controllers/database/fetch/fetch-user-information.controllers";
import {FetchPostInformationController} from "./controllers/database/fetch/fetch-post-information";
import {FetchCommentInformationController} from "./controllers/database/fetch/fetch-comment-information.controllers";
import {StoreUserInformationController} from "./controllers/database/store/store-user-information.controllers";
import {StoreCommentInformationController} from "./controllers/database/store/store-comment-information.controllers";
const swaggerUi = require('swagger-ui-express') ;
const swaggerDocument = require('./swagger.json');
const cookieParser = require('cookie-parser');

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
        this.addController(new LogInController(this.database));

        this.addController(new DeleteController(this.database));
        this.addController(new FetchUserInformationController(this.database));
        this.addController(new FetchCommentInformationController(this.database));
        this.addController(new FetchPostInformationController(this.database));
        this.addController(new StoreUserInformationController(this.database));
        this.addController(new StoreCommentInformationController(this.database));
        this.addController(new StorePostInformationController(this.database));

        this.addController(new UserProfileController());
        this.addController(new CreatePostController());

        // We link the router of each controller to our server
        this.controllers.forEach(controller => {
            this.app.use(`${this.path}${controller.path}`, controller.router);
        });
    }

    public addController(controller: BaseController): void {
        this.controllers.set(controller.constructor.name, controller);
    }

    private _initializeMiddleware(): void {
        // this.app.set('view engine', 'ejs');
        //this.app.use(session({
        //    secret: 'Maxim',
        //    resave: true,
        //    saveUninitialized: true
        //}));
        this.app.use(cors({
            origin: (origin, callback) => {
                // Allow requests from any origin
                callback(null, origin || '*');
            },
            credentials: true, // Allow cookies and credentials
        }));
        this.app.use(cookieParser());

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