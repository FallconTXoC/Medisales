const assert = require( "chai" ).assert;
const mocha = require( "mocha" );
const statsService  = require("/services/StatsService");

mocha.describe("Stats Service", () => {
    const StatsServiceInstance = new statsService();

    mocha.describe("Create instance of service", () => {
        it("Is not null", () => {
            assert.isNotNull(StatsServiceInstance);
        });

        it("Exposes the getStats method", () => {
            assert.isFunction(StatsServiceInstance.getStats);
        });
    });
});