$(document).ready(function() {
    $("#mobile-menu").click(function() {
        $("nav ul").toggleClass("active")
        console.log("toggle")
    })
    
    addTile("MineSweeper", "#games-list")
    addTile("TickTackToe", "#games-list")

    //add UI experiments
    addTile("Who is the wolf?!", "#uiexp-list", "Wer_istder_Wolf")
    addTile("TODO second ui page", "#uiexp-list")

})


const ProjectDescriptions = new Map();
ProjectDescriptions.set("MineSweeper", "Just a JS-Implementation of MineSweeper, not all features there. Works also on mobile.")
ProjectDescriptions.set("TickTackToe", "I think you know Tick Tack Toe, but this one has an AI included! Works also on mobile.")

ProjectDescriptions.set("Who is the wolf?!", "Design Experiment for an online-game.")

function getDesc(name) {
    if(ProjectDescriptions.has(name)) return ProjectDescriptions.get(name)
    else {
        return "no description available :("
    }
}

function addTile(name, parent, filename) {

    filename = (filename)? filename : name
    parent = $(parent) //gets parent element
    const rootDiv = $("<a class='smallCard' href='/"+filename+"/index.html'>")
    rootDiv.append($("<img src='imgs/projects/"+filename+".png' alt='"+name+"'>"))
    rootDiv.append($("<h1>"+name+"</h1>"))
    rootDiv.append($("<p>"+getDesc(name)+"</p>"))
    parent.append(rootDiv)
}

