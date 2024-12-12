import {BaseController} from "../base.controller";

export abstract class BaseDatabaseController extends BaseController {

    protected constructor() {
        super("/db");
    }

}