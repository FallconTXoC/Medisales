const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const week = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const colors = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
]

let contractsDataWeek = [0,0,0,0,0,0];
let teamContractsDataMonth = [];
let teamMembersData;
let team = [];
let contractsOfMonth = 0;
let weekGoal = 0;
let teamGoalWeekData = []

let goalProgress = [];

const schartElement = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(schartElement, {
    type: 'bar',
    data: {
        labels: week,
        datasets: [{
            label: `Qtt de contrats signés`,
            data: contractsDataWeek,
            backgroundColor: [
                'rgba(0,157,230, 0.2)',
                'rgba(115,151,243, 0.2)',
                'rgba(183,138,238, 0.2)',
                'rgba(238,122,213, 0.2)',
                'rgba(255,111,174, 0.2)',
                'rgba(255,115,125, 0.2)',
                'rgba(255,137,74, 0.2)',
                'rgba(255,166,0, 0.2)',
                'rgba(255,130,27, 0.2)',
                'rgba(255,83,58, 0.2)',
                'rgba(255,0,90, 0.2)',
                'rgba(255,0,126, 0.2)',
            ],
            borderColor: [
                'rgba(0,157,230, 1)',
                'rgba(115,151,243, 1)',
                'rgba(183,138,238, 1)',
                'rgba(238,122,213, 1)',
                'rgba(255,111,174, 1)',
                'rgba(255,115,125, 1)',
                'rgba(255,137,74, 1)',
                'rgba(255,166,0, 1)',
                'rgba(255,130,27, 1)',
                'rgba(255,83,58, 1)',
                'rgba(255,0,90, 1)',
                'rgba(255,0,126, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                suggestedMax: 10,
            }
        },
        maintainAspectRatio: false,
    }
});

const dchartElement = document.getElementById('contractsChart').getContext('2d');
const contractsChart = new Chart(dchartElement, {
    type: 'doughnut',
    data: {
        labels: team,
        datasets: [{
            label: 'Ventes du mois',
            data: teamContractsDataMonth,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            hoverOffset: 4
        }]
    },
    options: {
        maintainAspectRatio: false,
        borderWidth: 3,

        plugins: {
            legend: {
                display: false
            }
        }
    }
});

const objChartElement = document.getElementById('goalChart').getContext('2d');
const goalChart = new Chart(objChartElement, {
    type: 'doughnut',
    data: {
        labels: ["Progression", "Objectif"],
        datasets: [{
            label: 'Objectif hebdomadaire',
            data: goalProgress,
            backgroundColor: [
                'rgb(87,214,167)',
                'rgb(207,216,220)',
            ],
            hoverOffset: 4
        }]
    },
    options: {
        maintainAspectRatio: false,
        borderWidth: 0,
        cutout: 110,

        plugins: {
            legend: {
                display: false
            }
        }
    }
});

const teamChartElement = document.getElementById('goalTeamChart').getContext('2d');
const goalTeamChart = new Chart(teamChartElement, {
    type: 'line',
    data: {
        labels: week,
        datasets: [
        ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
                suggestedMax: weekGoal,
            }
        },
        maintainAspectRatio: false,
        bezierCurve: false,
    }
});

await getStatsData(true);

async function getStatsData(update) {
    const contractsOfWeek = (await (await fetch("/statistics/getWeekContracts")).json()).contracts;
    for(let contract in contractsOfWeek) {
        let contractData = contractsOfWeek[contract];
        let day = (new Date(contractData.Date).getDay() === 0) ? 6 : (new Date(contractData.Date).getDay()) - 1;
        contractsDataWeek[day] += 1;
    }

    teamMembersData = (await (await fetch("/statistics/getTeamMembers")).json()).team;

    for(let member in teamMembersData) {
        let memberContractsNbr = (await (await fetch(`/statistics/getMemberMonthContractsNbr?id=${teamMembersData[member].ID}`)).json()).contractsNbr;

        team.push(teamMembersData[member].Nom);
        teamContractsDataMonth.push(memberContractsNbr);

        let memberContractsOfWeek = (await (await fetch(`/statistics/getWeekContracts?id=${teamMembersData[member].ID}`)).json()).contracts;
        let weekContracts = [0,0,0,0,0,0,0];

        for(let contract in memberContractsOfWeek) {
            let contractData = memberContractsOfWeek[contract];
            let day = (new Date(contractData.Date).getDay() === 0) ? 6 : (new Date(contractData.Date).getDay()) - 1;
            weekContracts[day] += 1;
        }

        teamGoalWeekData.push(weekContracts);
        goalTeamChart.data.datasets.push(
            {
                label: `${teamMembersData[member].Nom}`,
                data: teamGoalWeekData[(team.length) - 1],
                borderColor: colors[(team.length) - 1],
                backgroundColor: colors[(team.length) - 1],
            },
        )
    }

    for(let contractNbr of teamContractsDataMonth) {
        contractsOfMonth += contractNbr;
    }

    document.getElementById("salesNbr").innerHTML = contractsOfMonth;
    if(contractsOfMonth > 1) document.getElementById("salesLibelle").innerHTML = "Ventes";
    else document.getElementById("salesLibelle").innerHTML = "Vente";

    weekGoal = (await (await fetch("/statistics/getWeekGoal")).json()).goal;
    if(!(Number.isInteger(weekGoal))) weekGoal = 0;
    else document.getElementById("goalLibelle").innerHTML = `Signer ${weekGoal} contrats`;
    
    let progress = weekGoal - Object.keys(contractsOfWeek).length;
    if(progress < 0) progress = 0;

    if(contractsOfMonth > 1) document.getElementById("goalSalesLibelle").innerHTML = "CONTRATS SIGNÉS";
    else document.getElementById("goalSalesLibelle").innerHTML = "CONTRAT SIGNÉ";
    document.getElementById("goalSalesNbr").innerHTML = Object.keys(contractsOfWeek).length;

    goalProgress = [Object.keys(contractsOfWeek).length, progress];

    if(update === true) {
        goalChart.data.datasets[0].data = goalProgress;
        salesChart.update();
        contractsChart.update();
        goalChart.update();
        goalTeamChart.update();
    }
}

setInterval(function() {
    getStatsData(true);
}, 300000)