
//load

// Draw the chart and set the chart values
function drawVotingChart() {
    let chartcanvas = $("<canvas/>", {
        id: "chart-canvas"
    }).prop({
        width: 400,
        height: 200,
    });
    $(".chartjs-size-monitor").remove();
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
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 18
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                        fontSize: 18,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                        fontSize: 14,
                        stepSize: 1,
                    }
                }]
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
    setModal($(".btn-nightmode"), $("#night-modal"));
    
    //Popup für die Rollenbeschreibung
    setModal($(".btn-role"), $("#role-modal"));

  
    //Popup zur Erklärung des aktuellen Status
    setModal($("#btn-state"), $("#state-modal"));
    
    //Popup zur Erklärung des aktuellen Status
    setModal($("#show-voting-btn"), $("#voting-modal"));
    
    drawVotingChart();

    $(window).resize(function(){
        drawVotingChart();
    });
}



