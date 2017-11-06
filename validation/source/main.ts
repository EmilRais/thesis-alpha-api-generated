import { RequestHandler } from "express";
import { Rule } from "paradise";

import { BoardRule } from "./board.rule";
import { FacebookTokenRule } from "./facebook-token.rule";
import { UserRule } from "./user.rule";

export interface AbstractOperation {
    module: string;
    schema: Schema;
}

export interface FacebookToken {
    is_valid: boolean;
    app_id: string;
    expires_at: number;
    user_id: string;
}

type Schema = "board" | "user" | "facebook-token";

function selectStrategy(schema: Schema): RequestHandler {
    return (request, response, next) => {
        switch ( schema ) {
            case "board":
                return BoardRule().guard(request.body)
                    .then(() => next())
                    .catch(error => response.status(400).json(error));

            case "user":
                return UserRule().guard(request.body)
                    .then(() => next()
                    ).catch(error => response.status(400).json(error));

            case "facebook-token":
                return FacebookTokenRule(new Date().getTime() / 1000).guard(response.locals.boards)
                    .then(() => request.body.userId === response.locals.boards.user_id ? Promise.resolve() : Promise.reject("User id mismatch"))
                    .then(() => next())
                    .catch(error => response.status(401).end("Ugyldigt Facebook-login"));

            default: throw new Error(`validation could not recognise schema "${schema}"`);
        }
    };
}

export const prepareOperation = (abstractOperation: AbstractOperation) => {
    if ( !abstractOperation.schema ) return Promise.reject("validation expected a schema");
    const strategy = selectStrategy(abstractOperation.schema);

    const concreteOperation: RequestHandler = (request, response, next) => {
        strategy(request, response, next);
    };

    return Promise.resolve(concreteOperation);
};
