$(document).ready(function() {
    $("#mobile-menu").click(function() {
        $("nav ul").toggleClass("active")
        console.log("toggle")
    })
    
    addTile("MineSweeper", "#games-list")
    addTile("TickTackToe", "#games-list")

    //add Programming experiments
    addTile("Who is the wolf?!", "#prexp-list", "Wer_istder_Wolf")
    addTile("Shadow2D", "#prexp-list")
    addTile("RacingGame", "#prexp-list")
    addTile("Snake", "#prexp-list")

    //add Photography experiments
    addTile("Architecture", "#photo-list")
    addTile("Sports", "#photo-list")
    addTile("Nature", "#photo-list")
    addTile("People", "#photo-list")

})


const ProjectDescriptions = new Map();
ProjectDescriptions.set("MineSweeper", "Just a JS-Implementation of MineSweeper, not all features there. Works also on mobile.")
ProjectDescriptions.set("TickTackToe", "I think you know Tick Tack Toe, but this one has an AI included! Works also on mobile.")

ProjectDescriptions.set("Shadow2D", "Method to render 2d Shadows (for Poligons)... Sourcecode also contains 'random' raycast method.")
ProjectDescriptions.set("Who is the wolf?!", "Design Experiment for an online-game.")

ProjectDescriptions.set("RacingGame", "2D Retro Game ported from C++ (by javidx9).")
ProjectDescriptions.set("Snake", "2D Pixel Snake, currently working on AI with A* Pathfinding.")

//photography
ProjectDescriptions.set("Architecture", "Timeless images which capture the beauty of human created buildings.")

ProjectDescriptions.set("Sports", "People in action, pushing the limits.")

ProjectDescriptions.set("Nature", "Our planet provides great motives by itself. My favourites: sunsets and the ocean.")

ProjectDescriptions.set("People", "Streetphotography or Portraits : both interesting areas.")

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

