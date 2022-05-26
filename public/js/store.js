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