import { RequestHandler } from "express";

export interface AbstractOperation {
    module: string;
    status: number;
}

export const prepareOperation = (abstractOperation: AbstractOperation) => {
    const status = abstractOperation.status;
    if ( !status ) return Promise.reject("response expected a status");
    if ( typeof status !== "number" ) return Promise.reject("response expected status to be a number");

    const concreteOperation: RequestHandler = (request, response, next) => {
        const boards = response.locals.boards;
        return response.status(status).json(boards);
    };

    return Promise.resolve(concreteOperation);
};
