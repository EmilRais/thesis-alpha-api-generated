import * as chai from "chai";
const should = chai.should();

import { json } from "body-parser";
import { RequestHandler } from "express";
import * as express from "express";
import { Server } from "http";
import * as agent from "superagent";

import { FacebookToken, Operation, prepareOperation } from "../source/main";

describe("operation", () => {

    it("should reject if invalid schema", () => {
        const abstractOperation: Operation = { module: "validation", schema: "book" as any };
        return prepareOperation(abstractOperation)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.equal('validation could not recognise schema "book"'));
    });

    it("should reject with 400 if input is invalid board", () => {
        const board = { name: "some-name", image: 42 };
        const abstractOperation: Operation = { module: "validation", schema: "board" };
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
        const abstractOperation: Operation = { module: "validation", schema: "board" };
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
        const abstractOperation: Operation = { module: "validation", schema: "user" };
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
        const abstractOperation: Operation = { module: "validation", schema: "user" };
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
        const abstractOperation: Operation = { module: "validation", schema: "facebook-token" };
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
        const abstractOperation: Operation = { module: "validation", schema: "facebook-token" };
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

    it("should reject with 400 if post is invalid", () => {
        const abstractOperation: Operation = { module: "validation", schema: "post" };
        const location = { latitude: 42, longitude: 1337, name: "some-name", city: "some-city", postalCode: "some-postal-code" };
        const post = { description: "some-long-description", kind: "LOST", date: 0, image: "some-image", location: location };

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
                                .send(post)
                                .catch(error => error.response)
                                .then(response => {
                                    runningServer.close();
                                    response.status.should.equal(400);
                                    response.body.should.deep.equal(['"$.title" was missing']);
                                    resolve();
                                })
                                .catch(reject);
                        });
                });
            });
    });

    it("should continue to next operation if post is valid", () => {
        const abstractOperation: Operation = { module: "validation", schema: "post" };
        const location = { latitude: 42, longitude: 1337, name: "some-name", city: "some-city", postalCode: "some-postal-code" };
        const post = { title: "some-title", description: "some-long-description", kind: "LOST", date: 0, image: "some-image", location: location };

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
                                .send(post)
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

    it("should reject with Unauthorized if not matching login", () => {
        const abstractOperation: Operation = { module: "validation", schema: "matching-login" };
        const credential = { password: "some-password" };
        const user = { credential: { password: "some-other-password" } };

        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(updateBoards(user))
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
                                    response.text.should.equal("Forkert kodeord");
                                    resolve();
                                })
                                .catch(reject);
                        });
                });
            });
    });

    it("should proceed to next operation if matching login", () => {
        const abstractOperation: Operation = { module: "validation", schema: "matching-login" };
        const credential = { password: "some-password" };
        const user = { credential: { password: "some-password" } };

        return prepareOperation(abstractOperation)
            .then(operation => {
                return new Promise((resolve, reject) => {
                    express()
                        .use(json())
                        .use(updateBoards(user))
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
