import { RequestHandler } from "express";
import { MongoClient, ObjectId } from "mongodb";

export interface AbstractOperation {
    module: string;
    collection: string;
    host?: string;
}

export const prepareOperation = (abstractOperation: AbstractOperation) => {
    const collection = abstractOperation.collection;
    if ( !collection ) return Promise.reject("mongo-update expected a collection");

    const host = abstractOperation.host || "mongo";

    return MongoClient.connect(`mongodb://${host}:27017/database`)
        .then(database => {

            const concreteOperation: RequestHandler = (request, response, next) => {
                const user = response.locals.boards;
                const filter = { _id: user._id };

                const credential = request.body;
                const update = {
                    $set: { credential: credential }
                };

                const options = { returnOriginal: false };

                database.collection(collection).findOneAndUpdate(filter, update, options)
                    .then(result => {
                        response.locals.boards = result.value;
                        next();
                    })
                    .catch(next);
            };

            (concreteOperation as any).database = database;

            return concreteOperation;
        });
};
