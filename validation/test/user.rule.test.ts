describe("UserRule", () => {
    it("should fail if user is missing");
    it("should fail if user is not an object");
    it("should fail if user has unrecognised fields");
    it("should fail if user has invalid email");
    it("should fail if user has missing credential");
    it("should fail if user credential is not an object");
    it("should fail if user credential is of invalid type");
});

describe("AlphaApiCredentialRule", () => {
    it("should fail if alpha api credential is missing");
    it("should fail if alpha api credential is not an object");
    it("should fail if alpha api credential has unrecognised fields");
    it("should fail if alpha api credential is missing type");
    it("should fail if alpha api credential type is wrong");
    it("should fail if alpha api credential is missing email");
    it("should fail if alpha api credential email is not a string");
    it("should fail if alpha api credential email is not an email");
    it("should fail if alpha api credential is missing password");
    it("should fail if alpha api credential password is not a string");
    it("should fail if alpha api credential password is shorter than 6 characters");
    it("should fail if alpha api credential password is longer than 32 characters");
});

describe("FacebookCredentialRule", () => {
    it("should fail if facebook credential is missing");
    it("should fail if facebook credential is not an object");
    it("should fail if facebook credential has unrecognised fields");
    it("should fail if facebook credential is missing type");
    it("should fail if facebook credential type is wrong");
    it("should fail if facebook credential is missing user id");
    it("should fail if facebook credential user id is not a string");
    it("should fail if facebook credential is missing token");
    it("should fail if facebook credential token is not a string");
});
