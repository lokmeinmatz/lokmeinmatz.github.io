
let table = [];

let data = [];

let validInputs = false;

function solved(data) {
  
}

function solve(){

}

let STATES = {
  VALID: 1,
  INVALID: -1,
  EMPTY: 0,
};

class Cell {

  constructor(x, y, final){
    this.x = x;
    this.final = final;
    this.y = y;
    this.value = 0;
    this.html = null;
    this.possible = [];
  }


  setState(state){
    switch (state) {
      case STATES.EMPTY:
        this.html.removeClass("valid");
        this.html.removeClass("invalid");
        if(!this.html.hasClass("empty"))this.html.addClass("empty");
        break;

      case STATES.VALID:
        this.html.removeClass("invalid");
        this.html.removeClass("empty");
        if(!this.html.hasClass("valid"))this.html.addClass("valid");
        break;

      case STATES.INVALID:
        this.html.removeClass("valid");
        this.html.removeClass("empty");
        if(!this.html.hasClass("invalid"))this.html.addClass("invalid");
        break;

      default:

    }
  }
}

function getPeers(x, y) {
  let peers = [];

  //add all off row
  for(tx = 0; tx < 9; tx++){
    if(tx != x){
      peers.push(data[tx][y]);
    }
  }

  //add all off column
  for(ty = 0; ty < 9; ty++){
    if(ty != y){
      peers.push(data[x][ty]);
    }
  }

  //add all from box
  let startx = Math.floor(x / 3) * 3;
  let starty = Math.floor(y / 3) * 3;
  for(let dx = startx; dx < startx + 3; dx++){
    for(let dy = starty; dy < starty + 3; dy++){
      if(!(dx == x && dy == y) && peers.indexOf(data[dx][dy]) == -1)peers.push(data[dx][dy]);
    }
  }

  return peers;
}

$(function(){

  $("#sudoku_table input").each(function () {
    //$(this).val(counter.toString());
    $(this).addClass("empty");
    table.push($(this));
    $(this).on('input', function(){ validInputs = false;
    $("#bttn").text("VALIDATE"); });
  });



  $("#bttn").click(function () {
    if(!validInputs){
      validate();
      if(validInputs){
        $(this).text("SOLVE");
      }
    }
  });

});


function validate(){
  data = [];
  for(let x = 0; x < 9; x++)data.push([]);
  validInputs = true;
  for(let i = 0; i < table.length; i++){
    //generate coord
    let c = new Cell(i % 9, (i - (i % 9)) / 9, table[i].val()?true:false);
    c.value = table[i].val();
    c.html = table[i]
    data[c.x][c.y] = c;
    if(table[i].val()){
      //not null
      if(table[i].val() > 0 && table[i].val() <= 9){
        //valid
        c.setState(STATES.VALID)
      }
      else{
        //invald input
        //no input
        c.setState(STATES.INVALID)
        validInputs = false;
      }
    }
    else{
      //no input
      c.setState(STATES.EMPTY)
    }
  }

  //ceck if same number is in row / column / group
  for(let x = 0; x < 9; x++){
    for(let y = 0; y < 9; y++){
      let current = data[x][y];

      if(!current || !current.value)continue;

      let peers = getPeers(x, y);
      for(let i = 0; i < peers.length; i++){
        let f = peers[i];
        if(f.value == current.value){
          current.setState(STATES.INVALID);
          validInputs = false;
          break;
        }
      }

    }
  }

  //test
  let peers = getPeers(1, 1);
  console.log(peers);

  peers.forEach(f => {

  });
}
