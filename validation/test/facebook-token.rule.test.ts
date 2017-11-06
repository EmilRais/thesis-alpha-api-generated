import * as chai from "chai";
const should = chai.should();

import { FacebookTokenRule } from "../source/facebook-token.rule";
import { FacebookToken } from "../source/main";

describe("FacebookRule", () => {
    it("should fail if token is missing", () => {
        const facebookToken: FacebookToken = null;
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" was missing']));
    });

    it("should fail if token is not an object", () => {
        const facebookToken: FacebookToken = 42 as any;
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$" was not an object']));
    });

    it("should fail if token is missing valid flag", () => {
        const facebookToken: FacebookToken = { is_valid: null, app_id: "1092068880930122", expires_at: 1000, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.is_valid" was missing']));
    });

    it("should fail if token valid flag is not true", () => {
        const facebookToken: FacebookToken = { is_valid: 42 as any, app_id: "1092068880930122", expires_at: 1000, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.is_valid" was 42 but should be true']));
    });

    it("should fail if token is missing app id", () => {
        const facebookToken: FacebookToken = { is_valid: true, app_id: null, expires_at: 1000, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.app_id" was missing']));
    });

    it("should fail if token app id is not correct", () => {
        const facebookToken: FacebookToken = { is_valid: true, app_id: "1234", expires_at: 1000, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.app_id" was 1234 but should be 1092068880930122']));
    });

    it("should fail if token is missing expiration date", () => {
        const facebookToken: FacebookToken = { is_valid: true, app_id: "1092068880930122", expires_at: null, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.expires_at" was missing']));
    });

    it("should fail if token expiration date is not a number", () => {
        const facebookToken: FacebookToken = { is_valid: true, app_id: "1092068880930122", expires_at: true as any, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.expires_at" was not a number']));
    });

    it("should fail if token expiration date is not in the future", () => {
        const facebookToken: FacebookToken = { is_valid: true, app_id: "1092068880930122", expires_at: 999, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken)
            .then(() => Promise.reject("Expected failure"))
            .catch(error => error.should.deep.equal(['"$.expires_at" was 999 but should be at least 1000']));
    });

    it("should succeed if token is valid", () => {
        const facebookToken: FacebookToken = { is_valid: true, app_id: "1092068880930122", expires_at: 1000, user_id: "some-user-id" };
        return FacebookTokenRule(1000).guard(facebookToken);
    });
});
