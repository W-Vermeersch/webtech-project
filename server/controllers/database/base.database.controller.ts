import {BaseController} from "../base.controller";

/*This is a abstract class for the database routers. They will extend this class.*/ 
export abstract class BaseDatabaseController extends BaseController {

    protected constructor() {
        super("/db");
    }

}