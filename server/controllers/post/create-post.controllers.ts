import {BaseController} from "../base.controller";
import * as express from "express";
import { authenticateToken } from "../user-authentification/login.controllers";

export class CreatePostController extends BaseController {


    constructor() {
        super("/post");
    }
