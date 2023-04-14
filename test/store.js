const assert = require("chai").assert;
const mocha = require("mocha");
const storeService  = require("/services/StoreService");

mocha.describe("Store Service", () => {
    const StoreServiceInstance = new storeService();

    mocha.describe("Create instance of service", () => {
        it("Is not null", () => {
            assert.isNotNull(StoreServiceInstance);
        });

        it("Exposes the getItems method", () => {
            assert.isFunction(StoreServiceInstance.getItems);
        });
    });
});