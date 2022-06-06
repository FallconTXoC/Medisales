const actionsButtons = function(cell, formatterParams){
    let buttons = `<div class="buttons-container">
                        <a href="#" class="edit-contract" contractID=${cell.getValue()}><i class="fa-regular fa-pen-to-square"></i></a>
                        <a href="#" class="delete-contract" contractID=${cell.getValue()}><i class="fa-regular fa-trash-can"></i></a>
                    </div>`;

    return buttons;
};
const frequency = function(cell, formatterParams){
    return (cell.getValue > 1) ? `${cell.getValue()} livraisons/mois` : `${cell.getValue()} livraison/mois`;
}
let notifier = new AWN();
let contracts = {}
let tableData = [];
let contractID = "";
let contractToDelete = "";
let contractsToDelete = [];

let table = new Tabulator("#contracts-table", {
    selectable:true,
    layout:"fitColumns",
    columns:[
        {formatter:"rowSelection", titleFormatter:"rowSelection", width:70, headerSort:false},
        {title:"Nom client", field:"clientName"},
        {title:"Produit", field:"prodName"},
        {title:"Signature", field:"dateSignature", hozAlign:"left", sorter:"date"},
        {title:"Fin de contrat", field:"dateFinContrat", hozAlign:"left", sorter:"date"},
        {title:"Quantité", field:"qtt", hozAlign:"left", sorter:"number"},
        {formatter: frequency, title:"Fréquence", field:"freq", hozAlign:"left", sorter:"number"},
        {formatter: actionsButtons, title:"", field:"actions", hozAlign:"center", width:150, headerSort: false},
    ],
    rowClick:function(e, row){
        //e - the click event object
        //row - row component

        row.toggleSelect();
    },
});

table.on('rowSelected', (e, row) => {
    console.log(table.getSelectedData())
    $('.contract-button').removeClass('hidden');
})
table.on('rowDeselected', (e, row) => {
    if(table.getSelectedRows().length === 0) $('.contract-button').addClass('hidden');
})
$('#delete-contracts').on('click', () => {
    contractsToDelete = table.getSelectedData();

    let onOk = () => {
        $.post('/contracts/deleteContracts', {contracts: contractsToDelete})
        .done(() => {
            $('#delete-contracts').addClass('hidden');
            notifier.success("Les contrats ont été supprimés avec succès");
            tableData = [];
            getContracts();
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
    
    let onCancel = () => {
        contractsToDelete = [];
    };
    notifier.confirm(
        "Êtes-vous sûr de vouloir supprimer ces contrats ?",
        onOk,
        onCancel,
        {
            labels: {
                confirm: "Attention",
                confirmOk: "Oui",
                confirmCancel: "Annuler"
            }
        }
    )
})

setupModal();
await getContracts();

async function getContracts() {
    contracts = (await (await fetch('/contracts/getContracts')).json()).contracts;

    for (let contract in contracts) {
        let contract_data = contracts[contract];

        let clientData = (await (await fetch(`/contracts/getClient/${contract_data.CodeClient}`)).json()).client;
        let productData = (await (await fetch(`/store/getProduct/${contract_data.CodeProd}`)).json()).product;

        let contractTableData = {
            id: contract_data.ID,
            contractID: contract_data.ID,
            clientName: clientData.Nom,
            prodName: productData.Libelle,
            dateSignature: new Date(contract_data.Date).toLocaleDateString("fr"),
            dateFinContrat: new Date(contract_data.DateFin).toLocaleDateString("fr"),
            qtt: parseInt(contract_data.QTT),
            freq: parseInt(contract_data.Frequence),
            actions: contract_data.ID
        }

        tableData.push(contractTableData);
    }

    table.setData(tableData)
    .then(() => {
        $(".edit-contract").on("click", (e) => {
            contractID = ($(e.target).closest("a")).attr("contractID");
            editContract();
        })
        $('#dateFin').prop("min", new Date().toISOString().split('T')[0]);
        $(".delete-contract").on("click", (e) => {
            contractToDelete = ($(e.target).closest("a")).attr("contractID");

            let onOk = () => {
                $.post('/contracts/delete', {id: contractToDelete})
                .done(() => {
                    notifier.success("Le contrat a été supprimé avec succès");
                    tableData = [];
                    getContracts();
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
            
            let onCancel = () => {
                contractToDelete = "";
            };
            notifier.confirm(
                "Êtes-vous sûr de vouloir supprimer ce contrat ?",
                onOk,
                onCancel,
                {
                    labels: {
                        confirm: "Attention",
                        confirmOk: "Oui",
                        confirmCancel: "Annuler"
                    }
                }
            )
        })
    })
}

let appendthis = "<div class='js-modal-close modal-overlay'></div>";

function checkModalInputs() {
    let disabled = false;
    $('.contract-modal-input').each((i, obj) => { if(obj.value === "") disabled = true; })
    $('#modify_contract').prop("disabled", disabled);
}

function editContract() {
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(200, 0.7);
    $("#contract-modal").fadeIn();
}

function setupModal() {
    $(`#modify_contract`).on("click", (e) => {
        console.log("click")
        const contractData = {
            id: contractID,
            qtt: $(`#qtt`).val(),
            frequency: $(`#freq`).val(),
            dateFin: $(`#dateFin`).val(),
        }

        $.post(`/contracts/update`, contractData)
        .done(function(data) {
            notifier.success("Le contrat a été mis à jour avec succès");
            contractID = "";
            tableData = [];
            getContracts();
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

        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
            $(this).trigger('reset');
        });
    })
    $(".js-modal-no").click(function() {
        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
        });
    })

    $(".js-modal-close, .modal-overlay").click(function() {
        $(".modal-box, .modal-overlay").fadeOut(100, function() {
            $(".modal-overlay").remove();
        });
    });
}