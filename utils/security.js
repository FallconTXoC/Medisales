const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

module.exports = { 
    escapeHtml: function (string) {
        return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
          return entityMap[s];
        });
    },

    /**
     * Validates the string by escaping special chars and
     * validating the sanitized string with the given regex.
     * 
     * @param {string} string 
     * @param {regex} regex 
     * @returns string or false
     */
    validateString: function (string, regex) {
        let sanitized_string = this.escapeHtml(string);
        return (string && sanitized_string.match(regex)) ? sanitized_string : false;
    },

    /**
     * Returns usable regex for data validation.
     * @returns {object} available regex strings
     */
    regex: function() {
        let regex = {};

        regex["stdStrRegex"] = /^[a-zA-Z\u00c0-\u024f\u1e00-\u1eff ]+$/i;
        regex["idRegex"] = /^[a-zA-Z0-9]+$/i;
        regex["postalAddressRegex"] = /\d+(?:\s?[a-zA-Z]+)+$/i;
        regex["zipcodeRegex"] = /^[0-9]{5}$/i;

        //RFC2822 compliant regex
        regex["mailRegex"] = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

        return regex;
    },
};