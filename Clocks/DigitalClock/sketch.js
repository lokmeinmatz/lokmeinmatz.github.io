if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

let stateDict = {};
//                a  b  c  d  e  f  g1 g2 h  i  j  k  l  m dt
stateDict["0"] = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0];
stateDict["1"] = [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
stateDict["2"] = [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["3"] = [1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0,	0, 0, 0];
stateDict["4"] = [0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["5"] = [1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0];
stateDict["6"] = [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["7"] = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["8"] = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["9"] = [1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];

//                a  b  c  d  e  f  g1 g2 h  i  j  k  l  m dt
stateDict["A"] = [1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["B"] = [1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0];
stateDict["C"] = [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["D"] = [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0];
stateDict["E"] = [1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["F"] = [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["G"] = [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["H"] = [0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["I"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0];
stateDict["J"] = [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["K"] = [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0];
stateDict["L"] = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["M"] = [0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0];
stateDict["N"] = [0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0];
stateDict["O"] = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["P"] = [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["Q"] = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
stateDict["R"] = [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0];
stateDict["S"] = [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["T"] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0];
stateDict["U"] = [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["V"] = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0];
stateDict["W"] = [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0];
stateDict["X"] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0];
stateDict["Y"] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0];
stateDict["Z"] = [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0];

//                a  b  c  d  e  f  g1 g2 h  i  j  k  l  m dt
stateDict["$"] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
stateDict[" "] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
stateDict["."] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
stateDict["-"] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
stateDict["<"] = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
stateDict[">"] = [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0];
stateDict["\\"] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];
stateDict["/"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0];




function CharLine(length, y){
  this.chars = [];
  this.text = "// hello ";
  this.offset = 0;
  let charwidth = width / length;
  for(let i = 0; i < length; i++){
    this.chars.push(new Char(10 + charwidth*i, y, charwidth * 0.9, charwidth * 2, "0"));
  }

  this.updateChars = function () {
    this.offset++;
    let tempstr = this.text.toUpperCase();
    let str = "";

    for(let i = 0; i < this.chars.length; i++){
      let index = (i + this.offset) % tempstr.length;
      str += tempstr[index];
    }

    //console.log("Setting string to "+str);
    for(let i = this.chars.length - 1; i >= 0; i--){
      let strIndex = i + str.length - this.chars.length;
      if(strIndex < 0){
        this.chars[i].value = " ";
      }
      else{
        let char = str[strIndex];
        if(char in stateDict){
          this.chars[i].value = char;
        }
        else{
          console.log("Char "+char+" is not in dict!");
          this.chars[i].value = "$";
        }
      }
    }
  }

  this.draw = function(){
    for(let i = 0; i < this.chars.length; i++){
      this.chars[i].draw(false);
    }
  }
}


let chl = undefined;
function setup() {
  createCanvas(1000, 1000);
  //chl.string = "Hallo Mama. wie gehts";
  chl = new CharLine(20, 10);


  setInterval(function () {

    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let seconds = date.getSeconds();
    chl.text = " // "+hour.toString().padStart(2)+"-"+minute.toString().padStart(2)+"-"+seconds.toString().padStart(2);

    chl.updateChars();
    clear();
    stroke(255, 0, 0);
    strokeWeight(0.05);
    strokeCap(ROUND);
    chl.draw();
  }, 500);


}
function draw() {



}


function Char(x, y, width, height, value){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.value = value;
  this.cells = undefined;

  this.draw = function (dot) {
    let state = null;
    if(this.cells)state = this.cells;
    else state = stateDict[this.value];
    if(!state)return;
    push();
    translate(this.x, this.y);
    scale(this.width, this.height);

    //Draw a
    if(state[0]){
      line(0.1, 0.05, 0.9, 0.05);
    }
    //Draw b
    if(state[1]){
      line(0.95, 0.1, 0.95, 0.45);
    }
    //Draw c
    if(state[2]){
      line(0.95, 0.55, 0.95, 0.9);
    }
    //Draw d
    if(state[3]){
      line(0.1, 0.95, 0.9, 0.95);
    }
    //Draw e
    if(state[4]){
      line(0.05, 0.55, 0.05, 0.9);
    }
    //Draw f
    if(state[5]){
      line(0.05, 0.1, 0.05, 0.45);
    }
    //Draw g1
    if(state[6]){
      line(0.1, 0.5, 0.45, 0.5);
    }
    //Draw g2
    if(state[7]){
      line(0.55, 0.5, 0.9, 0.5);
    }
    //Draw h
    if(state[8]){
      line(0.1, 0.1, 0.45, 0.45);
    }
    //Draw i
    if(state[9]){
      line(0.5, 0.1, 0.5, 0.45);
    }
    //Draw j
    if(state[10]){
      line(0.9, 0.1, 0.55, 0.45);
    }
    //Draw k
    if(state[11]){
      line(0.1, 0.9, 0.45, 0.55);
    }
    //Draw l
    if(state[12]){
      line(0.5, 0.9, 0.5, 0.55);
    }
    //Draw m
    if(state[13]){
      line(0.9, 0.9, 0.55, 0.55);
    }
    //Draw dt
    if(state[14] || dot){
      line(1.1, 1, 1, 1);
    }

    pop();
  }

}
