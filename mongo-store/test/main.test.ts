import * as chai from "chai";
const should = chai.should();

import { json } from "body-parser";
import { RequestHandler } from "express";
import * as express from "express";
import { Db, MongoClient } from "mongodb";
import * as agent from "superagent";

import { AbstractOperation, prepareOperation } from "../source/main";

describe("operation", () => {
    let database: Db;

    before(() => {
        return MongoClient.connect("mongodb://localhost:27017/database").then(db => database = db);
    });

    after(() => {
        database.close();
    });

    it("should fail if collection has not been specified", () => {
        const abstractOperation: AbstractOperation = { module: "mongo-store", collection: "" };
        return prepareOperation(abstractOperation)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => {
                error.should.equal("mongo-store expected a collection");
            });
    });

    it("should store request.body in boards collection", () => {
        const abstractOperation: AbstractOperation = { module: "mongo-store", collection: "Users", host: "localhost" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(operation)
                        .listen(3030, function() {
                            const runningServer = this;

                            const boards = [
                                { _id: "1", name: "some-board-1" },
                                { _id: "2", name: "some-board-2" }
                            ];

                            agent.post("localhost:3030")
                                .send(boards)
                                .catch(error => error.response)
                                .then(response => {
                                    (operation as any).database.close();
                                    runningServer.close();

                                    return database.collection("Users").find().toArray()
                                        .then((storedBoards: any) => {
                                            storedBoards.should.deep.equal(boards);
                                            resolve();
                                        });
                                })
                                .catch(reject);
                        });
                });
            });
    });
});
