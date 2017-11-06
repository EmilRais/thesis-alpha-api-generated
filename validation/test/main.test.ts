import * as chai from "chai";
const should = chai.should();

import { json } from "body-parser";
import { RequestHandler } from "express";
import * as express from "express";
import { Server } from "http";
import * as agent from "superagent";

import { AbstractOperation, FacebookToken, prepareOperation } from "../source/main";

describe("operation", () => {

    it("should reject with 400 if input is invalid board", () => {
        const board = { name: "some-name", image: 42 };
        const abstractOperation: AbstractOperation = { module: "validation", schema: "board" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(operation)
                        .use(success())
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

    it("should continue to next operation if input is valid board", () => {
        const board = { name: "some-name", image: "some-image" };
        const abstractOperation: AbstractOperation = { module: "validation", schema: "board" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(operation)
                        .use(success())
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

    it("should reject with 400 if input is invalid user", () => {
        const user = {
            email: "some-invalid-email",
            credential: { type: "alpha-api", email: "some@email.dk", password: "some-password" }
        };
        const abstractOperation: AbstractOperation = { module: "validation", schema: "user" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(operation)
                        .use(success())
                        .listen(3030, function() {
                            const runningServer: Server = this;
                            agent.post("localhost:3030")
                                .send(user)
                                .catch(error => error.response)
                                .then(response => {
                                    runningServer.close();
                                    response.status.should.equal(400);
                                    response.body.should.deep.equal(['"$.email" was not an email address']);
                                    resolve();
                                })
                                .catch(reject);
                        });
                });
            });
    });

    it("should continue to next operation if input is valid user", () => {
        const user = {
            email: "some@email.dk",
            credential: { type: "alpha-api", email: "some@email.dk", password: "some-password" }
        };
        const abstractOperation: AbstractOperation = { module: "validation", schema: "user" };
        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(operation)
                        .use(success())
                        .listen(3030, function() {
                            const runningServer: Server = this;
                            agent.post("localhost:3030")
                                .send(user)
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

    it("should reject with 401 if response.locals.boards is an invalid facebook token", () => {
        const abstractOperation: AbstractOperation = { module: "validation", schema: "facebook-token" };
        const credential = { userId: "some-user-id" };
        const facebookToken: FacebookToken = {} as FacebookToken;

        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(updateBoards(facebookToken))
                        .use(operation)
                        .use(success())
                        .listen(3030, function() {
                            const runningServer: Server = this;
                            agent.post("localhost:3030")
                                .send(credential)
                                .catch(error => error.response)
                                .then(response => {
                                    runningServer.close();
                                    response.status.should.equal(401);
                                    response.text.should.equal("Ugyldigt Facebook-login");
                                    resolve();
                                })
                                .catch(reject);
                        });
                });
            });
    });

    it("should continue to next operation if response.locals.boards is a valid facebook token", () => {
        const abstractOperation: AbstractOperation = { module: "validation", schema: "facebook-token" };
        const credential = { userId: "some-user-id" };

        const expirationDate = (new Date().getTime() / 1000) + 60;
        const facebookToken: FacebookToken = { is_valid: true, app_id: "1092068880930122", expires_at: expirationDate, user_id: "some-user-id" };

        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(updateBoards(facebookToken))
                        .use(operation)
                        .use(success())
                        .listen(3030, function() {
                            const runningServer: Server = this;
                            agent.post("localhost:3030")
                                .send(credential)
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

const updateBoards: (boards: any) => RequestHandler = (boards) => {
    return (request, response, next) => {
        response.locals.boards = boards;
        next();
    };
};

const success: () => RequestHandler = () => {
    return (request, response, next) => {
        response.status(200).end();
    };
};
