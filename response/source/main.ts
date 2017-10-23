import { RequestHandler } from "express";

export const prepareOperation = (abstractOperation: any) => {

    const concreteOperation: RequestHandler = (request, response, next) => {
        const boards = response.locals.boards;
        return response.status(200).json(boards);
    };

    return Promise.resolve(concreteOperation);
};
