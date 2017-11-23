import * as chai from "chai";
const should = chai.should();

import { json } from "body-parser";
import { ErrorRequestHandler, RequestHandler } from "express";
import * as express from "express";
import { Db, MongoClient } from "mongodb";
import * as agent from "superagent";

import { AbstractOperation, prepareOperation } from "../source/main";

describe("operation", () => {
    let database: Db;

    before(() => {
        return MongoClient.connect("mongodb://localhost:27017/database").then(db => database = db);
    });

    afterEach(() => {
        return database.dropDatabase();
    });

    after(() => {
        return database.close();
    });

    it("should fail if collection has not been specified", () => {
        const abstractOperation: AbstractOperation = { module: "mongo-update", collection: null, host: "localhost" };
        return prepareOperation(abstractOperation)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.equal("mongo-update expected a collection"));
    });

    it("should update user's credential", () => {
        const abstractOperation: AbstractOperation = { module: "mongo-update", collection: "Users", host: "localhost" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(updateBoards({ _id: "some-id" }))
                        .use(operation)
                        .listen(3030, function() {
                            const runningServer = this;

                            const user = {
                                _id: "some-id",
                                name: "some-name",
                                credential: null as any
                            };
                            const credential = { userId: "some-user-id", token: "some-token" };
                            database.collection("Users").insert(user)
                                .then(() => agent.post("localhost:3030").send(credential).catch(error => error.response))
                                .then(response => {
                                    (operation as any).database.close();
                                    runningServer.close();

                                    return database.collection("Users").find().toArray()
                                        .then((boards: any) => {
                                            boards.should.deep.equal([{
                                                _id: "some-id",
                                                name: "some-name",
                                                credential: credential
                                            }]);
                                            resolve();
                                        });
                                })
                                .catch(reject);
                        });
                });
            });
    });

    it("should store updated object in response.locals.boards", () => {
        const abstractOperation: AbstractOperation = { module: "mongo-update", collection: "Users", host: "localhost" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(updateBoards({ _id: "some-id" }))
                        .use(operation)
                        .use(responseHandler)
                        .listen(3030, function() {
                            const runningServer = this;

                            const user = {
                                _id: "some-id",
                                name: "some-name",
                                credential: null as any
                            };
                            const credential = { userId: "some-user-id", token: "some-token" };
                            database.collection("Users").insert(user)
                                .then(() => agent.post("localhost:3030").send(credential).catch(error => error.response))
                                .then(response => {
                                    (operation as any).database.close();
                                    runningServer.close();

                                    response.status.should.equal(200);
                                    response.body.should.deep.equal({
                                        _id: "some-id",
                                        name: "some-name",
                                        credential: credential
                                    });
                                    resolve();
                                })
                                .catch(reject);
                        });
                });
            });
    });
});

const updateBoards: (boards: any) => RequestHandler = boards => {
    return (request, response, next) => {
        response.locals.boards = boards;
        next();
    };
};

const responseHandler: RequestHandler = (request, response, next) => {
    response.status(200).json(response.locals.boards);
};

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    response.status(500).end(error.message);
};
