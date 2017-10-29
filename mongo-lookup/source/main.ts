import { RequestHandler } from "express";
import { MongoClient } from "mongodb";

export const prepareOperation = (abstractOperation: any) => {
    return MongoClient.connect("mongodb://mongo:27017/database")
        .then(database => {

            const concreteOperation: RequestHandler = (request, response, next) => {
                database.collection("Boards").find().toArray()
                    .then(boards => {
                        response.locals.boards = boards;
                        next();
                    })
                    .catch(next);
            };

            (concreteOperation as any).database = database;

            return concreteOperation;
        });
};
