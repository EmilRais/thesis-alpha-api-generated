import * as chai from "chai";
const should = chai.should();

import { LocationRule, PostRule } from "../source/post.rule";

describe("PostRule", () => {
    it("should fail if post is missing", () => {
        const post = null as any;
        return PostRule().guard(post)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" was missing']));
    });

    it("should fail if post is not an object", () => {
        const post = 42;
        return PostRule().guard(post)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" was not an object']));
    });

    it("should fail if post is missing fields", () => {
        const post = {};
        return PostRule().guard(post)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal([
                '"$.title" was missing',
                '"$.description" was missing',
                '"$.kind" was missing',
                '"$.date" was missing',
                '"$.image" was missing',
                '"$.location" was missing'
            ]));
    });

    it("should fail if post fields are of invalid type", () => {
        const post = { title: 42, description: {}, kind: "LOST", date: "date", image: 13, location: "location" };
        return PostRule().guard(post)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal([
                '"$.title" was not a string',
                '"$.description" was not a string',
                '"$.date" was not a number',
                '"$.image" was not a string',
                '"$.location" was not an object'
            ]));
    });

    it("should fail if post fields are of invalid length", () => {
        const location = { latitude: 42, longitude: 1337, name: "some-name", city: "some-city", postalCode: "some-postal-code" };
        const post = { title: "title", description: "some-description", kind: "LOST", date: 0, image: "", location: location };
        return PostRule().guard(post)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal([
                '"$.title" was 5 characters long but should be at least 10',
                '"$.description" was 16 characters long but should be at least 20',
                '"$.image" was 0 characters long but should be longer than 0'
            ]));
    });

    it("should fail if post kind is invalid", () => {
        const location = { latitude: 42, longitude: 1337, name: "some-name", city: "some-city", postalCode: "some-postal-code" };
        const post = { title: "some-title", description: "some-long-description", kind: "PENDING", date: 0, image: "some-image", location: location };
        return PostRule().guard(post)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.kind" was PENDING but should be LOST | FOUND']));
    });

    it("should succeed if post is valid", () => {
        const location = { latitude: 42, longitude: 1337, name: "some-name", city: "some-city", postalCode: "some-postal-code" };
        const post = { title: "some-title", description: "some-long-description", kind: "LOST", date: 0, image: "some-image", location: location };
        return PostRule().guard(post);
    });
});

describe("LocationRule", () => {
    it("should fail if location is missing", () => {
        const location = null as any;
        return LocationRule().guard(location)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" was missing']));
    });

    it("should fail if location is not an object", () => {
        const location = 42;
        return LocationRule().guard(location)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" was not an object']));
    });

    it("should fail if location is missing fields", () => {
        const location = {};
        return LocationRule().guard(location)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal([
                '"$.latitude" was missing',
                '"$.longitude" was missing',
                '"$.name" was missing',
                '"$.city" was missing',
                '"$.postalCode" was missing'
            ]));
    });

    it("should fail if location fields are of invalid type", () => {
        const location = { latitude: "latitude", longitude: "longitude", name: 42, city: 1337, postalCode: 13 };
        return LocationRule().guard(location)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal([
                '"$.latitude" was not a number',
                '"$.longitude" was not a number',
                '"$.name" was not a string',
                '"$.city" was not a string',
                '"$.postalCode" was not a string'
            ]));
    });

    it("should fail if location fields are of invalid length", () => {
        const location = { latitude: 42, longitude: 1337, name: "", city: "", postalCode: "" };
        return LocationRule().guard(location)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal([
                '"$.name" was 0 characters long but should be longer than 0',
                '"$.city" was 0 characters long but should be longer than 0',
                '"$.postalCode" was 0 characters long but should be longer than 0'
            ]));
    });

    it("should succeed if location is valid", () => {
        const location = { latitude: 42, longitude: 1337, name: "some-name", city: "some-city", postalCode: "some-postal-code" };
        return LocationRule().guard(location);
    });
});
