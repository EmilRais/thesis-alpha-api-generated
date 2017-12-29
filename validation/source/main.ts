import { RequestHandler } from "express";
import { Rule } from "paradise";

import { BoardRule } from "./board.rule";
import { FacebookTokenRule } from "./facebook-token.rule";
import { PostRule } from "./post.rule";
import { UserRule } from "./user.rule";

export interface Operation {
    module: string;
    schema: "facebook-token" | "board" | "user" | "post" | "matching-login";
}

export interface FacebookToken {
    is_valid: boolean;
    app_id: string;
    expires_at: number;
    user_id: string;
}

const facebookTokenHandler: RequestHandler = (request, response, next) => {
    FacebookTokenRule(new Date().getTime() / 1000).guard(response.locals.boards)
        .then(() => request.body.userId === response.locals.boards.user_id ? Promise.resolve() : Promise.reject("User id mismatch"))
        .then(() => next())
        .catch(error => response.status(401).end("Ugyldigt Facebook-login"));
};

const boardHandler: RequestHandler = (request, response, next) => {
    BoardRule().guard(request.body)
        .then(() => next())
        .catch(error => response.status(400).json(error));
};

const postHandler: RequestHandler = (request, response, next) => {
    PostRule().guard(request.body)
        .then(() => next())
        .catch(error => response.status(400).json(error));
};

const userHandler: RequestHandler = (request, response, next) => {
    UserRule().guard(request.body)
        .then(() => next())
        .catch(error => response.status(400).json(error));
};

const matchingLoginHandler: RequestHandler = (request, response, next) => {
    const specifiedPassword = request.body.password;
    const actualPassword = response.locals.boards.credential.password;

    if ( specifiedPassword !== actualPassword )
        return response.status(401).end("Forkert kodeord");

    next();
};

export const prepareOperation = (operation: Operation) => {
    if ( !operation.schema ) return Promise.reject("validation expected a schema");

    switch ( operation.schema ) {
        case "facebook-token": return Promise.resolve(facebookTokenHandler);
        case "board": return Promise.resolve(boardHandler);
        case "user": return Promise.resolve(userHandler);
        case "post": return Promise.resolve(postHandler);
        case "matching-login": return Promise.resolve(matchingLoginHandler);
        default: return Promise.reject(`validation could not recognise schema "${operation.schema}"`);
    }
};
