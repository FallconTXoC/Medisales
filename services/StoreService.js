const socketHelper = require("../utils/socket");
const Products = require("../models/products");
const ProductsInstance = new Products();

class StoreService {
    constructor() {
    }

    initSocket() {
        const io = socketHelper.getSockets();
        io.on('connection', (socket) => {
            socket.on("getSortedProducts", async (data) => {
                io.emit("sendSortedProducts", await getSortedProducts(data));
            });
        });
    }

    async getProducts() {
        return await ProductsInstance.getProducts();
    }

    async getSortedProducts(data) {
        const symptomes = data.symptomes ?? [];
        const principesActifs = data.principesActifs ?? [];
        const maladies = data.maladies ?? [];
        const forme = data.forme ?? [];
        const voieAdmin = data.voieAdmin ?? [];

        const tablesData = {
            tables: {
                Symptome: {
                    name: "Prod_Usage",
                    keyword: "pu",
                    propertyCode: "CodeSympt",
                    values: symptomes,
                    isInternal: false
                },
                PrincipeActif: {
                    name: "Prod_Contient",
                    keyword: "pc",
                    propertyCode: "CodeMol",
                    values: principesActifs,
                    isInternal: false
                },
                Maladie: {
                    name: "Prod_Combat",
                    keyword: "pco",
                    propertyCode: "CodeMaladie",
                    values: maladies,
                    isInternal: false
                },
                Forme: {
                    name: "Produit",
                    keyword: "p",
                    propertyCode: "CodeForme",
                    values: forme,
                    isInternal: true
                },
                VoieAdmin: {
                    name: "Produit",
                    keyword: "p",
                    propertyCode: "CodeVoieAdmin",
                    values: voieAdmin,
                    isInternal: true
                },
            }
        }

        return await ProductsInstance.sortProducts(tablesData);
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