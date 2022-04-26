const assert = require( "chai" ).assert;
const mocha = require( "mocha" );
const contractsService  = require("/services/ContractsService");

mocha.describe("Contracts Service", () => {
    const ContractsServiceInstance = new contractsService();

    mocha.describe("Create instance of service", () => {
        it("Is not null", () => {
            assert.isNotNull(ContractsServiceInstance);
        });

        it("Exposes the getContracts method", () => {
            assert.isFunction(ContractsServiceInstance.getContracts);
        });

        it("Checks the getContracts output to be an array", () => {
            assert.isArray(ContractsServiceInstance.getContracts());
        });
    });
});