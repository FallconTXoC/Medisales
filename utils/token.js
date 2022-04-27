const jwt = require(`jsonwebtoken`);

module.exports = {
    /**
     * Patch token to edit data
     * @param {string} token - Token to be patched REQUIRED
     * @param {object} data - Data to be patched REQUIRED
     * @return {promise} - Patched token
     */
     patchToken: async (token, data) => {
        return await new Promise((resolve) => {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) throw err
                let finalObject = {};
                for (const [key, value] of Object.entries(decoded)) {
                    if (key !== "exp" && key !== "iat") finalObject[key] = value
                }
                for (const [key, value] of Object.entries(data)) {
                    finalObject[key] = value
                }
                resolve(await module.exports.createToken(finalObject))
            })
        })
    },
    /**
     * Create a new token
     * @param {object} data - Data to be added to the token REQUIRED
     * @return {promise} - New token
     */
    createToken: async function (data) {
        return new Promise((resolve) => {
            let token = jwt.sign(data, process.env.JWT_SECRET, {
                expiresIn: '30d'
            });
            resolve(token)
        })
    },
    /**
     * Get authToken from token
     * @param {string} token - Token to be decrypted REQUIRED
     * @return {promise} - AuthToken
     */
    getAuthToken: async function (token) {
        return new Promise((resolve) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return console.log(err)
                resolve(decoded.authToken)
            })
        })
    },
}