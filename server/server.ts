import * as express from 'express';
import * as session from 'express-session';
import { BaseController, SignInController } from './controllers';
import * as path from 'path';
import cors = require("cors");


// app.use(cors(corsOptions));
//
// app.get("/", (req, res) => {
//     res.json({"fruits": ["apple", "orange", "banana"]});
// })


class TestController extends BaseController {

    constructor() {
        super("/");
    }
    initializeRoutes(): void {

        this.router.get("/", (req: express.Request, response: express.Response) => {
            return response.json({"fruits": ["apple", "orange", "banana"]});
        });
    }
}



export class App {
    app: express.Application;
    port: number = 5000;
    controllers: Map<string, BaseController> = new Map();
    path: string = "";



    constructor() {
        this.app = express();

        this._initializeMiddleware();
        this._initializeControllers();
        this.listen();
    }

    private _initializeControllers(): void {
        // Add new controllers here
        this.addController(new SignInController());
        this.addController(new TestController());
        // this.addController(new UserController());
        // TODO

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
        this.app.use(session({
            secret: 'Maxim',
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(cors());
        // this.app.use(cors({
        //     origin: false,//'http://localhost:5173', // Replace with your frontend's URL
        //     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
        //     credentials: true                // Allow credentials (like cookies)
        // }));

        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, "../static")));
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on http://localhost:${this.port}`);
        });
    }

}
export default new App();