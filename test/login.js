const assert = require("chai").assert;
const mocha = require("mocha");
const loginService = require("/services/LoginService");

mocha.describe("Login Service", () => {
    const LoginServiceInstance = new loginService();

    mocha.describe("Create instance of service", () => {
        it("Is not null", () => {
            assert.isNotNull(LoginServiceInstance);
        });

        it("Exposes the connection method", () => {
            assert.isFunction(LoginServiceInstance.connect);
        });
    });
});