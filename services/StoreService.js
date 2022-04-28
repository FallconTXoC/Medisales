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
                io.emit("sendSortedProducts", getSortedProducts(data));
            });
        });
    }

    getProducts() {
        return ProductsInstance.getProducts();
    }

    getSortedProducts(data) {
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
                    keyword: "pu",
                    propertyCode: "CodeSympt",
                    values: principesActifs,
                    isInternal: false
                },
                Maladie: {
                    name: "Prod_Combat",
                    keyword: "pu",
                    propertyCode: "CodeSympt",
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

        return ProductsInstance.sortProducts(tablesData);
    }

    getProductInfo(idprod) {
        let data = {
            produit: ProductsInstance.findByID(idprod),
            symptomes: ProductsInstance.getSymptomes(idprod),
            principesActifs: ProductsInstance.getPrincipesActifs(idprod),
            maladies: ProductsInstance.getMaladies(idprod),
            forme: ProductsInstance.getForme(idprod),
            voieAdmin: ProductsInstance.getVoieAdmin(idprod)
        }

        return data;
    }
}

module.exports = StoreService;