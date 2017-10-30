import { RequestHandler } from "express";

import { BoardRule } from "./board.rule";

export interface AbstractOperation {
    module: string;
}

export const prepareOperation = (abstractOperation: AbstractOperation) => {
    const rule = BoardRule();

    const concreteOperation: RequestHandler = (request, response, next) => {
        rule.guard(request.body)
            .then(() => next())
            .catch(error => response.status(400).json(error));
    };

    return Promise.resolve(concreteOperation);
};
