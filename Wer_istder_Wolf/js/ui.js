
//load

// Draw the chart and set the chart values
function drawVotingChart() {
    let chartcanvas = $("<canvas/>", {
        id: "chart-canvas"
    }).prop({
        width: 400,
        height: 200,
    });
    //if desktop mode: display chart directly
    if(window.innerWidth <= 800){
        $("#voting-results canvas").remove();
        $("#canvas-div canvas").remove();
        $("#canvas-div").append(chartcanvas);
    }
    else{
        $("#voting-results canvas").remove();
        $("#canvas-div canvas").remove();
        $("#voting-results").append(chartcanvas);
    }
    
    let ctx = chartcanvas[0].getContext("2d");

 

    let chart = new Chart(ctx, {
         // The type of chart we want to create
        type: 'bar',
    
        // The data for our dataset
        data: {
            labels: ["Joseph", "Matthias", "Sebastian"],
            
            datasets: [{
                label: "Aktuelle Abstimmung",
                data: [8, 3, 2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
    
        // Configuration options go here
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: '#fff',
                    fontSize: 15,
                }
            }
        }
    });
}

function onload() {
    $("#side-menu").slideUp();
    $("#open-side").click(function(){
        $("#side-menu").slideToggle();
    });

    //Popup at night
    $("#close-night-modal").click(StopNightMode);


    //Popup für die Rollenbeschreibung
    $("#card-info-btn").click(RoleDescription);
    $("#role-name").click(RoleDescription);
    $("#close-role-modal").click(CloseRoleDescription);

    //Popup zur Erklärung des aktuellen Status
    $("#state-btn").click(StateDescription);
    $("#close-state-modal").click(CloseStateDescription);

    //Popup zur Erklärung des aktuellen Status
    $("#show-voting-btn").click(ShowVotingModal);
    $("#close-voting-modal").click(CloseVotingModal);

    drawVotingChart();

    $(window).resize(function(){
        drawVotingChart();
    });
}

function NightMode() {
    console.log("Activated NightMode");
    $("#night-modal").css({"display": "block"});
}

function StopNightMode() {
    console.log("Stopped NightMode");
    $("#night-modal").css({"display": "none"});
}

function RoleDescription() {
    console.log("Show RoleDescription");
    $("#role-modal").css({"display": "block"});
}

function CloseRoleDescription() {
    console.log("Closing RoleDescription");
    $("#role-modal").css({"display": "none"});
}

function StateDescription() {
    console.log("Show StateDescription");
    $("#state-modal").css({"display": "block"});
}

function CloseStateDescription() {
    console.log("Closing StateDescription");
    $("#state-modal").css({"display": "none"});
}

function ShowVotingModal() {
    console.log("Show VotingModal");
    $("#voting-modal").css({"display": "block"});
    drawVotingChart();
}

function CloseVotingModal() {
    console.log("Closing VotingModal");
    $("#voting-modal").css({"display": "none"});
}