import {BaseController} from "../base.controller";
import Database from "../../database";


export abstract class UserAuthentificationController extends BaseController {
    constructor() {
        super("/user");
    }

    /**
     * Check if a string is actually provided
     *
     * @param {string} param Provided string
     * @returns {boolean} Valid or not
     */
    protected _isGiven(param: string): boolean {
        if (param == null)
            return false;
        else{
            return param.trim().length > 0;
        }
    }

    /**
     * Check if a string is a valid email
     *
     * @param {string} email Email string
     * @returns {boolean} Valid or not
     */
    protected _isEmailValid(email: string): boolean {
        const atIdx = email.indexOf("@");
        const dotIdx = email.lastIndexOf(".");
        console.log("at " + atIdx + " point " + dotIdx)
        return atIdx != -1 && dotIdx != -1 && dotIdx > atIdx;
    }
    protected samePassword(password1: string, password2: string): boolean {
        return password1 === password2
    }
    protected _isGoodPassword(password: string): boolean {
        return password.length >= 8;
    }
}