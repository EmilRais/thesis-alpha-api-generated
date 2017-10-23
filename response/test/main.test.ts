import * as chai from "chai";
const should = chai.should();

import { RequestHandler } from "express";
import * as express from "express";
import { Server } from "http";
import * as agent from "superagent";

import { prepareOperation } from "../source/main";

describe("operation", () => {
    let operation: RequestHandler;

    beforeEach(() => {
        return prepareOperation(null)
            .then(preparedOperation => operation = preparedOperation);
    });

    it("should return 200", () => {
        return new Promise((resolve, reject) => {
            express()
                .use(operation)
                .listen(3030, function() {
                    const runningServer: Server = this;
                    agent.get("localhost:3030")
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

    it("should return response.locals.boards as json", () => {
        const boards = [
            { name: "board1" },
            { name: "board2" }
        ];

        return new Promise((resolve, reject) => {
            express()
                .use(updateBoards(boards))
                .use(operation)
                .listen(3030, function() {
                    const runningServer: Server = this;
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

const updateBoards: (value: any) => RequestHandler = (boards) => {
    return (request, response, next) => {
        response.locals.boards = boards;
        next();
    };
};
