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