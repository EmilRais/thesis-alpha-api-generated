import { RequestHandler } from "express";
import { Rule } from "paradise";

import { BoardRule } from "./board.rule";
import { UserRule } from "./user.rule";

export interface AbstractOperation {
    module: string;
    schema: Schema;
}

type Schema = "board" | "user";

function selectStrategy(schema: Schema): Rule {
    switch ( schema ) {
        case "board": return BoardRule();
        case "user": return UserRule();
        default: throw new Error(`validation could not recognise schema "${schema}"`);
    }
}

export const prepareOperation = (abstractOperation: AbstractOperation) => {
    if ( !abstractOperation.schema ) return Promise.reject("validation expected a schema");
    const rule = selectStrategy(abstractOperation.schema);

    const concreteOperation: RequestHandler = (request, response, next) => {
        rule.guard(request.body)
            .then(() => next())
            .catch(error => response.status(400).json(error));
    };

    return Promise.resolve(concreteOperation);
};
