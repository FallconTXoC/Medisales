const socketHelper = require("../utils/socket");

const Products = require("../models/products");
const ProductsInstance = new Products();
const CommonQueries = require("../utils/common_queries");
const CommonQueriesInstance = new CommonQueries();

const securityUtils = require("../utils/security");
const regex = securityUtils.regex();
class StoreService {
    constructor() {
    }

    /**
     * Initialize sockets for the current instance.
     */
    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {
            socket.on("getSortedProducts", async (data) => {
                io.emit("sendProducts", await this.getSortedProducts(data));
            });
            socket.on("findByName", async (data) => {
                io.emit("sendProducts", await this.findProductsByName(data));
            })
        });
    }

    /**
     * Retrieves all products.
     * @returns {object} products
     */
    async getProducts() {
        return await ProductsInstance.getProducts();
    }

    /**
     * Retrieves all usable filters for the store page
     * @returns {object} filters
     */
    async getFilters() {
        return await ProductsInstance.getFilters();
    }

    /**
     * Retrieves all products with a name beginning by or being
     * the specified name.
     * 
     * @param {string} name 
     * @returns {object} products
     */
    async findProductsByName(name) {
        return await ProductsInstance.findByName(name);
    }

    /**
     * Retrieves a product based on its ID.
     * Returns object with error message on invalid data.
     * 
     * @param {string} id 
     * @returns {Object} error or product
     */
    async getProduct(id) {
        const productID = securityUtils.validateString(id, regex.idRegex);
        if(productID === false) return {success: false, message: "Mauvais ID de produit"};

        return await ProductsInstance.findByID(id);
    }

    /**
     * Creates an object containing the necessary information for the
     * sorting based on received data and following the data pattern explained
     * in the sortObjects function of common queries.
     * 
     * @param {object} data [symptomes, principesActifs, maladies, forme, voieAdmin]
     * @returns {object} sorted products
     */
    async getSortedProducts(data) {
        const symptomes = data.symptomes ?? [];
        const principesActifs = data.principesActifs ?? [];
        const maladies = data.maladies ?? [];
        const forme = data.forme ?? [];
        const voieAdmin = data.voieAdmin ?? [];

        const tablesData = {
            mainTable: {
                name: "Produit",
                propertyCode: "CodeProd"
            },
            criterias: {
                Symptome: {
                    table_name: "Prod_Usage",
                    keyword: "pu",
                    propertyCode: "CodeSympt",
                    values: symptomes,
                    isInternal: false
                },
                PrincipeActif: {
                    table_name: "Prod_Contient",
                    keyword: "pc",
                    propertyCode: "CodeMol",
                    values: principesActifs,
                    isInternal: false
                },
                Maladie: {
                    table_name: "Prod_Combat",
                    keyword: "pco",
                    propertyCode: "CodeMaladie",
                    values: maladies,
                    isInternal: false
                },
                Forme: {
                    table_name: "Produit",
                    keyword: "p",
                    propertyCode: "CodeForme",
                    values: forme,
                    isInternal: true
                },
                VoieAdmin: {
                    table_name: "Produit",
                    keyword: "p",
                    propertyCode: "CodeVoieAdmin",
                    values: voieAdmin,
                    isInternal: true
                },
            }
        }

        return await CommonQueriesInstance.sortObjects(tablesData);
    }

    /**
     * Retrieves all related information of a product based on its ID.
     * 
     * @param {string} idprod 
     * @returns {object} product data
     */
    async getProductInfo(idprod) {
        let data = {
            produit: await ProductsInstance.findByID(idprod),
            symptomes: await ProductsInstance.getSymptomes(idprod),
            principesActifs: await ProductsInstance.getPrincipesActifs(idprod),
            maladies: await ProductsInstance.getMaladies(idprod),
            forme: await ProductsInstance.getForme(idprod),
            voieAdmin: await ProductsInstance.getVoieAdmin(idprod)
        }

        return data;
    }
}

module.exports = StoreService;