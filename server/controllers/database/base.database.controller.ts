import {BaseController} from "../base.controller";
import Database from "../../database";

export abstract class BaseDatabaseController extends BaseController {

    protected constructor() {
        super("/db");
    }

}