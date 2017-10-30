import * as chai from "chai";
const should = chai.should();

import { RequestHandler } from "express";
import * as express from "express";
import { Db, MongoClient } from "mongodb";
import * as agent from "superagent";

import { AbstractOperation, prepareOperation } from "../source/main";

describe("operation", () => {

    let operation: RequestHandler;
    let database: Db;

    before(() => {
        const abstractOperation: AbstractOperation = { module: "mongo-lookup", collection: "Boards", host: "localhost" };
        return prepareOperation(abstractOperation)
            .then(preparedOperation => operation = preparedOperation)
            .then(() => MongoClient.connect("mongodb://localhost:27017/database").then(instance => database = instance));
    });

    after(() => {
        (operation as any).database.close();
        database.close();
    });

    it("should update response.locals.boards if boards collection is empty", () => {
        return new Promise((resolve, reject) => {
            express()
                .use(operation)
                .use(returnBoards)
                .listen(3030, function() {
                    const runningServer = this;
                    agent.get("localhost:3030")
                        .catch(error => error.response)
                        .then(response => {
                            runningServer.close();
                            response.body.should.deep.equal([]);
                            resolve();
                        })
                        .catch(reject);
                });
        });
    });

    it("should update response.locals.boards if boards collection is not empty", () => {
        return new Promise((resolve, reject) => {
            express()
                .use(operation)
                .use(returnBoards)
                .listen(3030, function() {
                    const runningServer = this;

                    const boards = [
                        { _id: "1", name: "some-board-1" },
                        { _id: "2", name: "some-board-2" }
                    ];

                    database.collection("Boards").insert(boards).then(() => {
                        agent.get("localhost:3030")
                            .catch(error => error.response)
                            .then(response => {
                                runningServer.close();
                                response.body.should.deep.equal(boards);
                                resolve();
                            })
                            .catch(reject);
                    });
                });
        });
    });
});

const returnBoards: RequestHandler = (request, response, next) => {
    const boards = response.locals.boards;
    response.status(200).json(boards);
};
