import { RequestHandler } from "express";
import { MongoClient } from "mongodb";

export interface AbstractOperation {
    module: string;
    host?: string;
}

export const prepareOperation = (abstractOperation: AbstractOperation) => {
    const host = abstractOperation.host || "mongo";

    return MongoClient.connect(`mongodb://${host}:27017/database`)
        .then(database => {

            const concreteOperation: RequestHandler = (request, response, next) => {
                database.collection("Boards").insert(request.body)
                    .then(() => next())
                    .catch(next);
            };

            (concreteOperation as any).database = database;

            return concreteOperation;
        });
};
