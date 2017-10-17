
let table = [];

let data = [];

let validInputs = false;

function solve(){

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
    data[i % 9][(i - (i % 9)) / 9] = table[i].val();
    if(table[i].val()){
      //not null
      if(table[i].val() > 0 && table[i].val() <= 9){
        //valid
        table[i].removeClass("invalid");
        table[i].removeClass("empty");
        if(!table[i].hasClass("valid"))table[i].addClass("valid");
      }
      else{
        //invald input
        //no input
        table[i].removeClass("valid");
        table[i].removeClass("empty");
        if(!table[i].hasClass("invalid"))table[i].addClass("invalid");
        validInputs = false;
      }
    }
    else{
      //no input
      table[i].removeClass("valid");
      table[i].removeClass("invalid");
      if(!table[i].hasClass("empty"))table[i].addClass("empty");
    }
  }

  //ceck if same number is in row / column / group
  for(let x = 0; x < 9; x++){
    for(let y = 0; y < 9; y++){
      let current = data[x][y];
      let i = (y * 9) + x;
      if(!current)continue;
      //test row
      for(tx = 0; tx < 9; tx++){
        if(tx != x && data[tx][y] == current){
          //exists
          table[i].removeClass("valid");
          table[i].removeClass("empty");
          if(!table[i].hasClass("invalid"))table[i].addClass("invalid");
          validInputs = false;
        }
      }

      //test column
      for(ty = 0; ty < 9; ty++){
        if(ty != y && data[ty][y] == current){
          //exists
          table[i].removeClass("valid");
          table[i].removeClass("empty");
          if(!table[i].hasClass("invalid"))table[i].addClass("invalid");
          validInputs = false;
        }
      }

    }
  }
}
