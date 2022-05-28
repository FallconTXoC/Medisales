import NotificationPopup from './notification-popup.js';
const socket = io();

let selected_products = [];
let contractProducts = [];
let productsInfo = {};
let contractInfo = {};

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
$('.contract-button').click(() => {
    selected_products = selected_products.filter(prod_id => prod_id !== undefined);
    contractProducts = [...selected_products];
    createContract("product-modal", contractProducts[0]);
});

function productTemplate(product) {
    const productHTML = `<div class="product" id="prod_${product.CodeProd}" prod-code=${product.CodeProd}>
                            <div class="content">
                                <div class="checkbox-container">
                                    <input type="checkbox" id="prodBtn_${product.CodeProd}" name="Products" value=${product.CodeProd}>
                                </div>
                                <img class="prod-image" src="" alt="Image d'illustration pour ${product.Libelle}">
                                <p class="prod-name" prod-code>${product.Libelle}</p>
                                <p class="prod-price">${(product.Prix).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}€/boîte</p>
                            </div>
                        </div>`
    return productHTML;
}

let appendthis = "<div class='js-modal-close modal-overlay'></div>";

function createContract(modalBox, productID = "") {
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(200, 0.7);
    $("#" + modalBox).fadeIn();
    switch(modalBox) {
        case "product-modal":
            console.log(productsInfo);
            let product_name = $(`.prod-name[prod-code=${productID}]`).html();
            $('#product-modal-title').html(`Modalités de contrat - ${product_name}`)
            $(`#add_product`).on("click", (e) => {
                const productData = {
                    prodID: productID,
                    qtt: $(`#qtt`).val(),
                    frequency: $(`#freq`).val(),
                    endDate: $(`#endDate`).val(),
                }
                productsInfo[`${productID}`] = productData;
                contractProducts.shift();
                $(".modal-box, .modal-overlay").fadeOut(100, function() {
                    $(".modal-overlay").remove();
                    $(this).trigger('reset');
                    if(contractProducts[0] !== undefined) createContract("product-modal", contractProducts[0])
                    else createContract("client-modal")
                });
            })
            $(".js-modal-no").click(function() {
                $(".modal-box, .modal-overlay").fadeOut(100, function() {
                    $(".modal-overlay").remove();
                });
                productsInfo = {};
            })
            break;
        case "client-modal":
            console.log(productsInfo);
            $.get(`/contracts/getClients`)
            .done(function(data) { 
                const clients = data.clients;
                let available_clients = [];
                for(let client of clients) {
                    available_clients.push(
                        { 
                            label:(client.Nom) + " (" + client.CP + ")",
                            nom: client.nom,
                            id: client.CodeClient,
                            type: client.Type,
                            mail: client.Mail,
                            street: address.Adresse,
                            city: address.Ville,
                            postcode: address.CP,
                        });
                }
                $("#libelle").autocomplete({
                    minLength:2,
                    delay: 300,
                    source: available_clients,
                    focus: function(event, ui) {
                        $("#libelle").val(ui.item.label);
                        return false;
                    },
                    select: function(event, ui) {
                        $("#libelle").val(ui.item.nom);
                        $("#idclient").val(ui.item.id);
                        $("#typeclient").val(ui.item.type);
                        $("#street").val(ui.item.street);
                        $("#zipcode").val(ui.item.postcode);
                        $("#city").val(ui.item.city);
                        $("#mail").val(ui.item.mail);
                        return false;
                    }
                });
                $(`#addClient_form`).on("submit", (e) => {
                    e.preventDefault();
                    const clientData = {
                        idclient: $(`#idclient`).val(),
                        nomClient: $(`#libelle`).val(),
                        street: $(`#street`).val(),
                        type: $(`#type`).val(),
                        postalcode: $(`#zipcode`).val(),
                        city: $(`#city`).val(),
                        mail: $(`#mail`).val(),
                    }

                    $.post(`/contracts/saveclient`, clientData)
                    .done(function(data) {
                        $(".modal-box, .modal-overlay").fadeOut(100, function() {
                            $(".modal-overlay").remove();
                        });
                        contractInfo["clientID"] = data.clientID;
                        contractInfo["productsData"] = productsInfo;

                        $.post(`/contracts/save`, {data: contractInfo})
                        .done(function(data) {
                            new NotificationPopup(`Succès`,`Succès de l'enregistrement`, "Le contrat a été enregistré avec succès", `success`).show();
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
                })
            })
            $(".js-modal-no").click(function() {
                $(".modal-box, .modal-overlay").fadeOut(100, function() {
                    $(".modal-overlay").remove();
                });
                productsInfo = {};
                contractInfo = {};
            })
            break;
    }

    $(".js-modal-close, .modal-overlay").click(function() {
        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
        });
    });
}

// function productModalTemplate(productID, step) {
//     const template = `<fieldset data-step="${step}">
//                         <div class="d-flex justify-content-between align-items-center">
//                             <h5>Modalités de contrat</h5>
//                             <span class="lead">${$(`.prod-name[prod-code=${productID}]`).html()}</span>
//                         </div>
//                         <hr>
//                         <div class="form-group row">
//                             <div class="col-sm-12">
//                                 <label for="qtt_${productID}">Quantité à livrer</label>
//                                 <input type="number" name="qtt_${productID}" id="qtt_${productID}" autocomplete="off" class="form-control" required>
//                             </div>
//                         </div>
//                         <div class="form-group row">
//                             <div class="col-sm-12">
//                                 <label for="freq_${productID}">Nombre de livraisons par mois</label>
//                                 <input name="freq_${productID}" id="freq_${productID}" type="number" autocomplete="off" class="form-control" required/>
//                             </div>
//                         </div>
//                         <div class="form-group row">
//                             <div class="col-sm-12">
//                                 <label for="endDate_${productID}">Durée de contrat en mois</label>
//                                 <input name="endDate_${productID}" id="endDate_${productID}" type="number" autocomplete="off" class="form-control" required/>
//                             </div>
//                         </div>
//                     </fieldset>`
//     return template;
// }

// function modalTemplate(productsTemplate) {
//     const template = `<div class="modal fade" id="contractModal" role="dialog" aria-labelledby="contractModal" data-current-step="1" aria-hidden="true">
//                         <div class="modal-dialog" role="document">
//                             <div class="modal-content">
//                                 <div class="modal-header">
//                                     <h5 class="modal-title" id="contractModalLabel">Création du contrat</h5>
//                                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//                                         <span aria-hidden="true">&times;</span>
//                                     </button>
//                                 </div>
//                                 <div class="modal-body">
//                                     <form action="" method="post">
//                                         ${productsTemplate}

//                                         <fieldset data-step="${(selected_products.length + 1)}">
//                                             <div class="d-flex justify-content-between align-items-center">
//                                                 <h5>Informations client</h5>
//                                                 <span class="lead">#1</span>
//                                             </div>
//                                             <hr>
//                                             <div class="form-group row">
//                                                 <div class="col-sm-12">
//                                                     <label for="libelle">Nom du client</label>
//                                                     <input type="text" name="libelle" id="libelle" placeholder="ex. Apple" autocomplete="off" class="form-control" required>
//                                                 </div>
//                                             </div>
//                                             <div class="form-group row">
//                                                 <div class="col-sm-12">
//                                                     <label for="mail">Adresse mail</label>
//                                                     <input name="mail" id="mail" type="text" placeholder="ex. exemple@medisales.com" autocomplete="off" class="form-control" required/>
//                                                 </div>
//                                             </div>
//                                             <div class="form-group row">
//                                                 <div class="col-sm-12">
//                                                 <label for="type">Type de client</label>
//                                                 <input name="type" id="type" type="text" placeholder="ex. Médecin, Pharmacie..." autocomplete="off" class="form-control" required/>
//                                                 </div>
//                                             </div>
//                                         </fieldset>

//                                         <fieldset data-step="${(selected_products.length + 2)}">
//                                             <div class="d-flex justify-content-between align-items-center">
//                                                 <h5>Informations client</h5>
//                                                 <span class="lead">#2</span>
//                                             </div>
//                                             <hr>
//                                             <div class="form-group row">
//                                                 <div class="col-sm-12">
//                                                     <label for="street">Rue et n°</label>
//                                                     <input type="text" name="street" id="street" placeholder="ex. 71 rue de la soif" class="form-control" autocomplete="off">
//                                                 </div>
//                                             </div>
//                                             <div class="form-group row">
//                                                 <div class="col-sm-12">
//                                                     <label for="zipcode">Code postal</label>
//                                                     <input type="text" name="zipcode" id="zipcode" min=0 placeholder="ex. 69001" autocomplete="off" class="form-control" required>
//                                                 </div>
//                                             </div>
//                                             <div class="form-group row">
//                                                 <div class="col-sm-12">
//                                                     <label for="city">Ville</label>
//                                                     <input type="text" name="city" id="city" placeholder="ex. Lyon" autocomplete="off" class="form-control" required>
//                                                 </div>
//                                             </div>
//                                         </fieldset>

//                                         <div class="modal-footer">
//                                             <button type="button" class="btn btn-secondary" data-step-to="prev">
//                                                 Précédent
//                                             </button>
//                                             <button type="button" class="btn btn-success" data-step-to="next">
//                                                 Suivant
//                                             </button>
//                                             <button type="submit" class="btn btn-info">
//                                                 Confirmer
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>`

//     return template;
// }

// function createWizardModal() {
//     let productsTemplate = "";

//     let prod_count = 1;
//     selected_products.forEach((productID) => {
//         productsTemplate += productModalTemplate(productID, prod_count);
//         prod_count++;
//     })

//     const contractModal = modalTemplate(productsTemplate);
//     $('.content').append(contractModal);

//     $('#contractModal').modalWizard().on('submit', function (e) {
//         alert('submited');
//         $(this).trigger('reset');

//         $(this).modal('hide');
//     });
// }

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