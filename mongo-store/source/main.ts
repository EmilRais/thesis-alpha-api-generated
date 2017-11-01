import { RequestHandler } from "express";
import { MongoClient } from "mongodb";

export interface AbstractOperation {
    module: string;
    collection: string;
    host?: string;
}

export const prepareOperation = (abstractOperation: AbstractOperation) => {
    const collection = abstractOperation.collection;
    if ( !collection ) return Promise.reject("mongo-store expected a collection");

    const host = abstractOperation.host || "mongo";

    return MongoClient.connect(`mongodb://${host}:27017/database`)
        .then(database => {

            const concreteOperation: RequestHandler = (request, response, next) => {
                database.collection(collection).insert(request.body)
                    .then(() => next())
                    .catch(next);
            };

            (concreteOperation as any).database = database;

            return concreteOperation;
        });
};
