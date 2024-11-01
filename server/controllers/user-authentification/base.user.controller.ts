import {BaseController} from "../base.controller";


export abstract class UserAuthentificationController extends BaseController {
    constructor() {
        super("/user");
    }
}