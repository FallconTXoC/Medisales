const socketHelper = require("../utils/socket");
const Products = require("../models/products");
const ProductsInstance = new Products();
const CommonQueries = require("../utils/common_queries");
const CommonQueriesInstance = new CommonQueries();

class StoreService {
    constructor() {
    }

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

    async getProducts() {
        return await ProductsInstance.getProducts();
    }

    async getFilters() {
        return await ProductsInstance.getFilters();
    }

    async findProductsByName(name) {
        return await ProductsInstance.findByName(name);
    }

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