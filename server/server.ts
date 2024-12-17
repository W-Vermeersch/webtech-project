import * as express from 'express';
import * as controller from './controllers';
import cors = require("cors");
import Database from "./database";
const swaggerUi = require('swagger-ui-express') ;
const swaggerDocument = require('./swagger.json');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const selfSigned = require('selfsigned');

class FrontEndController extends controller.BaseController {
    constructor() {
        super("");
    }

    initializeRoutes(): void {
        this.router.get("/", (req, res) => {
            const header = JSON.stringify(req.headers.host)
            return res.redirect(`https://${header.split(':')[0].split('"')[1]}:${5173}`)
        });
    }
}

export class App {
    app: express.Application;
    port: number = 5000;
    controllers: Map<string, controller.BaseController> = new Map();
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
        this.addController(new controller.UserAuthenticationController(this.database));
        this.addController(new controller.DeleteController(this.database));
        this.addController(new controller.FetchUserInformationController(this.database));
        this.addController(new controller.FetchCommentInformationController(this.database));
        this.addController(new controller.FetchPostInformationController(this.database));
        this.addController(new controller.StoreUserInformationController(this.database));
        this.addController(new controller.StoreCommentInformationController(this.database));
        this.addController(new controller.StorePostInformationController(this.database));

        this.addController(new controller.UserProfileController());
        this.addController(new controller.CreatePostController());
        this.addController(new FrontEndController());

        // We link the router of each controller to our server
        this.controllers.forEach(controller => {
            this.app.use(`${this.path}${controller.path}`, controller.router);
        });
    }

    public addController(controller: controller.BaseController): void {
        this.controllers.set(controller.constructor.name, controller);
    }

    private _initializeMiddleware(): void {
        this.app.use(cors({
            origin: (origin, callback) => {
                callback(null, origin || '*');
            },
            credentials: true,
        }));
        this.app.use(cookieParser());

        this.app.use(express.json({ limit: "150mb" }));
        this.app.use(express.urlencoded({ limit: "150mb", extended: true }));

        this.database.init()
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    public listen() {
        // const attrs = [{ name: 'commonName', value: 'localhost' }];
        // const pems = selfSigned.generate(attrs, { days: 365 });

        // const options = {
        //     key: pems.private,
        //     cert: pems.cert,
        // };

        // https.createServer(options, this.app).listen(this.port, () => {
        //     console.log(`App listening on https://localhost:${this.port}`);
        // });

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
        process.on('SIGTERM', shutdown);
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err);
            shutdown().finally(() => process.exit(1));
          });
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection:', reason);
            shutdown().finally(() => process.exit(1));
          });
        process.on('SIGUSR1', shutdown);
        process.on('SIGUSR2', shutdown);

          

    }


}
export default new App();