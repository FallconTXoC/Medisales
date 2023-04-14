const socket = io();
let notifier = new AWN();

var selected_products = [];
var contractProducts = [];
var productsInfo = {};
var contractInfo = {};
var submitDone = false;
let productID = "";

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
initModals();

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
    productID = contractProducts[0];
    createContract("product-modal");
});
$('.product-modal-input').on('input', () => {
    let disabled = false;
    $('.product-modal-input').each((i, obj) => { if(obj.value === "") disabled = true; })
    $('#add_product').prop("disabled", disabled);
})
$('.client-modal-input').on('input', () => {
    let disabled = false;
    $('.client-modal-input').each((i, obj) => { if(obj.value === "") disabled = true; })
    $('#add_client').prop("disabled", disabled);
})


function productTemplate(product) {
    const productHTML = `<div class="product" id="prod_${product.CodeProd}" prod-code=${product.CodeProd}>
                            <div class="content">
                                <div class="checkbox-container">
                                    <input type="checkbox" id="prodBtn_${product.CodeProd}" name="Products" value=${product.CodeProd}>
                                </div>
                                <img class="prod-image" src="/assets/pills.png" alt="Image d'illustration pour ${product.Libelle}">
                                <p class="prod-name" prod-code>${product.Libelle}</p>
                                <p class="prod-price">${(product.Prix).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}€/boîte</p>
                            </div>
                        </div>`
    return productHTML;
}

let appendthis = "<div class='js-modal-close modal-overlay'></div>";

function createContract(modalBox) {
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(200, 0.7);
    $("#" + modalBox).fadeIn();
    switch(modalBox) {
        case "product-modal":
            let product_name = $(`.prod-name[prod-code=${productID}]`).html();
            $('#product-modal-title').html(`Modalités de contrat - ${product_name}`)
            break;

        case "client-modal":
            let asArray = Object.entries(productsInfo);
            productsInfo = Object.fromEntries(asArray.filter(([key, value]) => (selected_products.includes(key))));
            break;
    }
}

function bindProductsEvent() {
    $('.product').click(function(event) {
        const prodID = $(this).attr("prod-code");
    
        if($(this).hasClass('active') === true) {
            $(this).removeClass('active');
            $(`input[value=${prodID}]`).prop('checked', false);
            
            selected_products = selected_products.filter(prod_id => prod_id !== prodID);
            if(selected_products.length === 0) $('.contract-button').addClass('hidden');
        } else {
            $(this).addClass('active');
            $(`input[value=${prodID}]`).prop('checked', true);
            $('.contract-button').removeClass('hidden');
    
            selected_products.push(prodID);
        }
    })
}

function initModals() {
    $(`#add_product`).on("click", (e) => {
        const productData = {
            prodID: productID,
            qtt: $(`#qtt`).val(),
            frequency: $(`#freq`).val(),
            duree: $(`#duration`).val(),
        }
        productsInfo[`${productID}`] = productData;
        contractProducts = contractProducts.filter(prod_id => prod_id !== productID);
        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
            $(this).trigger('reset');
            if(contractProducts.length > 0) {
                productID = contractProducts[0];
                createContract("product-modal")
            }
            else createContract("client-modal")
        });
    })
    $(".js-modal-no").click(function() {
        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
        });
        let props = Object.getOwnPropertyNames(productsInfo);
        for (let i = 0; i < props.length; i++) delete productsInfo[props[i]];
    })



    $.get(`/contracts/getClients`)
    .done(function(data) { 
        const clients = data.clients;
        let available_clients = [];
        for(let client of clients) {
            available_clients.push(
                { 
                    label:(client.Nom) + " (" + client.CP + ")",
                    nom: client.Nom,
                    id: client.CodeClient,
                    type: client.Type,
                    mail: client.Mail,
                    street: client.Adresse,
                    city: client.Ville,
                    postcode: client.CP,
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
                $("#type").val(ui.item.type);
                $("#street").val(ui.item.street);
                $("#zipcode").val(ui.item.postcode);
                $("#city").val(ui.item.city);
                $("#mail").val(ui.item.mail);
                $('#add_client').prop("disabled", false);
                return false;
            }
        });
        $(`#addClient_form`).on("submit", (e) => {
            e.preventDefault();
            if(submitDone === false) {
                submitDone = true;
                let exists = false;
                if($(`#idclient`).val() !== "") exists = true;

                const clientData = {
                    exists: exists,
                    idclient: $(`#idclient`).val(),
                    clientName: $(`#libelle`).val(),
                    address: $(`#street`).val(),
                    type: $(`#type`).val(),
                    zipcode: $(`#zipcode`).val(),
                    city: $(`#city`).val(),
                    mail: $(`#mail`).val(),
                }

                for(let [key, value] of Object.entries(productsInfo)) {
                    const contractData = {
                        product: value,
                        client: clientData
                    }

                    $.post(`/contracts/save`, contractData)
                    .done(function(data) {
                        notifier.success("Le contrat a été enregistré avec succès");
                        productID = "";
                        submitDone = false;
                        $(".modal-box, .modal-overlay").fadeOut(100, function() {
                            $(".modal-overlay").remove();
                        });
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
                            notifier.alert(errorMessage);
                            submitDone = false;
                        }
                    })
                }
            }
        })
    })
    $(".js-modal-no").click(function() {
        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
        });
        let props = Object.getOwnPropertyNames(productsInfo);
        for (let i = 0; i < props.length; i++) delete productsInfo[props[i]];

        props = Object.getOwnPropertyNames(contractInfo);
        for (let i = 0; i < props.length; i++) delete contractInfo[props[i]];
    })



    $(".js-modal-close, .modal-overlay").click(function() {
        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
        });
    });
}

socket.on('sendProducts', (data) => {
    const products = document.querySelectorAll('.product');
    products.forEach((product) => {
        product.remove();
    })
    data.forEach((product) => {
        $('#store_products').append(productTemplate(product))
    })

    bindProductsEvent();
})