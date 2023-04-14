
var printIcon = function(cell, formatterParams){ //plain text value
    return "<i class='fa fa-print'></i>";
};

//Build Tabulator
var table = new Tabulator("#example-table", {
    layout:"fitColumns",
    columns:[
    {title:"Button", field:"selection", width:70, headerSort: false},
    {title:"ID", field:"progress", hozAlign:"right", sorter:"number"},
    {title:"Nom client", field:"gender"},
    {title:"Produit", field:"col"},
    {title:"Signature", field:"dob", hozAlign:"center", sorter:"date"},
    {title:"Fin de contrat", field:"car", hozAlign:"center", headerSort: false},
    {title:"Quantité", field:"progress", hozAlign:"right", sorter:"number"},
    {title:"Fréquence", field:"progress", hozAlign:"right", sorter:"number"},
    {title:"Action", field:"selection", width:70, headerSort: false},
    ],
});