import * as chai from "chai";
const should = chai.should();

import { BoardRule } from "../source/board.rule";

describe("BoardRule", () => {
    it("should fail if missing", () => {
        return BoardRule().guard(null)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" was missing']));
    });

    it("should fail if unrecognised field", () => {
        const board = { _id: "some-id", name: "some-name", image: "some-image" };
        return BoardRule().guard(board)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" has unrecognised field "_id"']));
    });

    it("should fail if name is missing", () => {
        const board = { image: "some-image" };
        return BoardRule().guard(board)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.name" was missing']));
    });

    it("should fail if name is not a string", () => {
        const board = { name: 42, image: "some-image" };
        return BoardRule().guard(board)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.name" was not a string']));
    });

    it("should fail if name is the empty string", () => {
        const board = { name: "", image: "some-image" };
        return BoardRule().guard(board)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.name" was 0 characters long but should be longer than 0']));
    });

    it("should fail if image is missing", () => {
        const board = { name: "some-name" };
        return BoardRule().guard(board)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.image" was missing']));
    });

    it("should fail if image is not a string", () => {
        const board = { name: "some-name", image: 42 };
        return BoardRule().guard(board)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.image" was not a string']));
    });

    it("should fail if image is the empty string", () => {
        const board = { name: "some-name", image: "" };
        return BoardRule().guard(board)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.image" was 0 characters long but should be longer than 0']));
    });

    it("should succeed if board is valid", () => {
        const board = { name: "some-name", image: "some-image" };
        return BoardRule().guard(board);
    });
});
