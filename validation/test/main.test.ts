import * as chai from "chai";
const should = chai.should();

import { json } from "body-parser";
import { RequestHandler } from "express";
import * as express from "express";
import { Server } from "http";
import * as agent from "superagent";

import { AbstractOperation, prepareOperation } from "../source/main";

describe("operation", () => {

    it("should reject with 400 if input is invalid", () => {
        const board = { name: "some-name", image: 42 };
        const abstractOperation: AbstractOperation = { module: "validation" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(operation)
                        .listen(3030, function() {
                            const runningServer: Server = this;
                            agent.post("localhost:3030")
                                .send(board)
                                .catch(error => error.response)
                                .then(response => {
                                    runningServer.close();
                                    response.status.should.equal(400);
                                    response.body.should.deep.equal(['"$.image" was not a string']);
                                    resolve();
                                })
                                .catch(reject);
                        });
                });
            });
    });

    it("should continue to next operation if input is valid", () => {
        const board = { name: "some-name", image: "some-image" };
        const abstractOperation: AbstractOperation = { module: "validation" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(operation)
                        .use(success)
                        .listen(3030, function() {
                            const runningServer: Server = this;
                            agent.post("localhost:3030")
                                .send(board)
                                .catch(error => error.response)
                                .then(response => {
                                    runningServer.close();
                                    response.status.should.equal(200);
                                    resolve();
                                })
                                .catch(reject);
                        });
                });
            });
    });
});

const success: RequestHandler = (request, response, next) => {
    response.status(200).end();
};
