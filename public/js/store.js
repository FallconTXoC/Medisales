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