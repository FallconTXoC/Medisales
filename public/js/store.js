import NotificationPopup from './notification-popup.js';
const socket = io();

let selected_products = [];

$('.multi-select').select2({
    theme: 'bootstrap-5',
    width: '14vw',
    height: '3vw',
    initSelection: function(element, callback) {                   
    },
});

$('.search-input')
    .blur(() => { $('.searchbar').removeClass('focused'); })
    .focus(() => { $('.searchbar').addClass('focused');});

bindProductsEvent();

$('.reset-button').click(() => {
    $('.multi-select').val([]).trigger('change');
    $('.filter-checkbox').prop('checked', false).trigger('change');
})
$('.search-icon').click(() => socket.emit("findByName", $('.search-input').val()));
$('.submit-filters').click(() => {
    const formes = [];
    const voiesAdmin = [];
    $("input:checkbox[name=Formes]:checked").each(function(){
        formes.push($(this).val());
    });
    $("input:checkbox[name=VA]:checked").each(function(){
        voiesAdmin.push($(this).val());
    });

    const data = {
        principesActifs: $('#principesActifs').val(),
        symptomes: $('#symptome').val(),
        maladies: $('#maladie').val(),
        forme: formes,
        voieAdmin: voiesAdmin,
    }
    socket.emit("getSortedProducts", data);
})
$('.contract-button').click(() => openContractModal());

function productTemplate(product) {
    const productHTML = `<div class="product" id="prod_${product.CodeProd}" prod-code=${product.CodeProd}>
                            <div class="content">
                                <div class="checkbox-container">
                                    <input type="checkbox" id="prodBtn_${product.CodeProd}" name="Products" value=${product.CodeProd}>
                                </div>
                                <img class="prod-image" src="" alt="Image d'illustration pour ${product.Libelle}">
                                <p class="prod-name">${product.Libelle}</p>
                                <p class="prod-price">${(product.Prix).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}€/boîte</p>
                            </div>
                        </div>`
    return productHTML;
}

function productModalTemplate(products) {
    console.log(products);
    let productModal = `<script type="text/template" id="modal-products-template">
                            <div class="bbm-modal__topbar">
                                <h3 class="bbm-modal__title">Création du contrat</h3>
                            </div>
                            <div class="bbm-modal__section">`

    products.forEach((product) => {
        productModal += `<div class="prod-section">
                            <h4 class="prod-title">${product.Libelle}</h4>
                            <div class="input-container">
                                <input type="number" class="modal-input" id="qtt_${product.CodeProd}" name="qtt_${product.CodeProd}">
                                <label for="qtt_${product.CodeProd}">Quantité</label>
                            </div>
                            <div class="input-container">
                                <input type="number" class="modal-input" id="freq_${product.CodeProd}" name="freq_${product.CodeProd}">
                                <label for="freq_${product.CodeProd}">Nombre de livraisons par mois</label>
                            </div>
                            <div class="input-container">
                                <input type="number" class="modal-input" id="duree_${product.CodeProd}" name="duree_${product.CodeProd}">
                                <label for="duree_${product.CodeProd}">Durée en mois</label>
                            </div>
                        </div>`
    })
    productModal += `</div>
                    <div class="bbm-modal__bottombar">
                        <a href="#" class="bbm-button previous inactive">Précédent</a>
                        <a href="#" class="bbm-button next">Suivant</a>
                    </div>
                </script>`

    return productModal;
}

async function addContractModal() {
    let products = await new Promise((resolve, reject) => {
        let prods = [];
        selected_products.forEach((product, index, array) => {
            $.post("/api/store/getProduct", {id: product})
            .done((productData) => {
                prods.push(productData);
                console.log(prods)
            })
            .fail(function(xhr, status, err) {
                let errorMessage;
                try {
                    if(xhr.responseJSON.error.message) {
                        errorMessage = xhr.responseJSON.error.message
                    } else {
                        errorMessage = xhr.responseJSON.error;
                    }
                } catch (e) {
                    errorMessage = "undefined error"
                }
                if(errorMessage) {
                    new NotificationPopup(`Erreur`,`Echec de l'enregistrement`, errorMessage, `error`).show();
                }
            })
            if (index === array.length -1) resolve(prods);
        })
    })

    const productsTemplate = productModalTemplate(products);
    const contractModal = `<script type="text/template" id="modal-template">
                                <div class="my-container"></div>
                            </script>

                            ${productsTemplate}

                            <script type="text/template" id="modal-client-template">
                                <div class="bbm-modal__topbar">
                                <h3 class="bbm-modal__title">Wizard example - step 2</h3>
                                </div>
                                <div class="bbm-modal__section">
                                <p>This is the second step of the wizard.</p>
                                </div>
                                <div class="bbm-modal__bottombar">
                                <a href="#" class="bbm-button previous">Previous</a>
                                <a href="#" class="bbm-button next">Next</a>
                                </div>
                            </script>

                            <script type="text/template" id="modal-sign-template">
                                <div class="bbm-modal__topbar">
                                <h3 class="bbm-modal__title">Wizard example - step 2</h3>
                                </div>
                                <div class="bbm-modal__section">
                                <p>This is the second step of the wizard.</p>
                                </div>
                                <div class="bbm-modal__bottombar">
                                <a href="#" class="bbm-button previous">Previous</a>
                                <a href="#" class="bbm-button next">Next</a>
                                </div>
                            </script>

                            <script type="text/template" id="modal-summary-template">
                                <div class="bbm-modal__topbar">
                                <h3 class="bbm-modal__title">Wizard example - step 3</h3>
                                </div>
                                <div class="bbm-modal__section">
                                <p>And finally, the last step!</p>
                                </div>
                                <div class="bbm-modal__bottombar">
                                <a href="#" class="bbm-button previous">Previous</a>
                                <a href="#" class="bbm-button done">Done</a>
                                </div>
                            </script>`
    $('.app-content').append(contractModal);
}

async function openContractModal() {
    await addContractModal();
    const Modal = Backbone.Modal.extend({
        template: _.template($('#modal-template').html()),
    
        viewContainer: '.my-container',
        submitEl: '.done',
        cancelEl: '.cancel',
    
        views: {
          'click #step1': {
            view: _.template($('#modal-products-template').html())
          },
          'click #step2': {
            view: _.template($('#modal-client-template').html())
          },
          'click #step3': {
            view: _.template($('#modal-sign-template').html())
          },
          'click #step4': {
            view: _.template($('#modal-summary-template').html())
          }
        },
    
        events: {
          'click .previous': 'previousStep',
          'click .next': 'nextStep'
        },
    
        previousStep: function(e) {
          e.preventDefault();
          this.previous();
        },
    
        nextStep: function(e) {
          e.preventDefault();
          this.next();
        }
    });

    const modalView = new Modal();
    $('.app').html(modalView.render().el);
}

function bindProductsEvent() {
    $('.product').click(function(event) {
        const prodID = $(this).attr("prod-code");
    
        if($(this).hasClass('active') === true) {
            $(this).removeClass('active');
            $(`input[value=${prodID}]`).prop('checked', false);
            
            selected_products = selected_products.filter(prod_id => prod_id !== prodID);
            if (selected_products.length === 0) $('.contract-button').addClass('hidden');
        } else {
            $(this).addClass('active');
            $(`input[value=${prodID}]`).prop('checked', true);
            $('.contract-button').removeClass('hidden');
    
            selected_products.push(prodID);
        }
    })
}

socket.on('sendProducts', (data) => {
    console.log(data)
    const products = document.querySelectorAll('.product');
    products.forEach((product) => {
        product.remove();
    })
    data.forEach((product) => {
        $('#store_products').append(productTemplate(product))
    })

    bindProductsEvent();
})