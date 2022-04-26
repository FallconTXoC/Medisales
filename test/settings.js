const assert = require( "chai" ).assert;
const mocha = require( "mocha" );
const settingsService  = require("/services/SettingsService");

mocha.describe("Settings Service", () => {
    const SettingsServiceInstance = new settingsService();

    mocha.describe("Create instance of service", () => {
        it("Is not null", () => {
            assert.isNotNull(SettingsServiceInstance);
        });

        it("Exposes the getSettings method", () => {
            assert.isFunction(SettingsServiceInstance.getSettings);
        });
    });
});