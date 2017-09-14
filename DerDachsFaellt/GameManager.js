var game = null;

function init() {
  game = new Phaser.Game(192*2, 108*2, Phaser.CANVAS, "", null, false, false);

  game.state.add("BootState", BootState);
  game.state.add("LoadingScreen", LoadingScreen);
  game.state.add("MainGame", MainGame);
  game.state.start("BootState");
};

var DAXboard = {
  BG_COLOR: "rgb(10, 10, 10)",
  DAXniveau: 12550,
  init: function () {
    let DAXctx = this.DAXcanvas.context;
    this.leftText.init(DAXctx);
    this.chart.arrowsTexture = game.cache.getImage("arrows", true);
  },

  leftText: {
    x: 10,
    y: 10,
    width: 80,
    height: 60,
    counter: 0,
    init: function (DAXctx) {
      //fill left side
      DAXctx.fillStyle = this.BG_COLOR;
      DAXctx.fillRect(1, 1, this.width + 19, 78);

      for(let i = 0; i < this.height/2; i++){
        this.update(DAXctx, true);
      }

    },
    update: function (DAXctx) {
      this.counter++;
      //shift image data up 2
      let imageData = DAXctx.getImageData(this.x, this.y + 2, this.width, this.height);

      //fill left side
      DAXctx.fillRect(1, 1, this.width + 19, 78);

      DAXctx.putImageData(imageData, this.x, this.y);


      if(this.counter >= 2){
        this.counter = 0;
        //draw new line
        let lineID = DAXctx.getImageData(this.x, this.y + this.height, this.width, 1);
        for(let dx = 0; dx <= this.width * 3.5; dx+= 4){
          let brightness = game.rnd.between(0, 255);
          lineID.data[dx + 0] = brightness;
          lineID.data[dx + 1] = brightness;
          lineID.data[dx + 2] = brightness;
          lineID.data[dx + 3] = 255;
        }
        DAXctx.putImageData(lineID, this.x, this.y + this.height);
      }
    }
  },

  chart: {
    arrowsTexture: null,
    x: 100,
    y: 10,
    width: 140,
    height: 60,
    values: [],
    lowestValue: 12500,
    highestValue: 12600,
    update: function (DAXctx, newValue) {

      //add new data to values, delete last if necessary
      this.values.push(newValue);
      if(this.values.length > 35)this.values.splice(0, 1);

      if(newValue < this.lowestValue)this.lowestValue = newValue;
      else if(newValue > this.highestValue)this.highestValue = newValue;
      //overdraw area
      DAXctx.fillStyle = DAXboard.BG_COLOR;
      DAXctx.fillRect(80, 1, game.width - 81, 78);

      DAXctx.strokeStyle = "rgb(255, 255, 255)";
      DAXctx.lineWidth = 1;
      //Draw data
      DAXctx.beginPath();
      let yStart =
      game.math.mapLinear(this.values[this.values.length - 1], this.lowestValue, this.highestValue, this.y + this.height, this.y);
      DAXctx.moveTo(this.x + this.width, yStart);
      let xOffset = (35 - this.values.length) * 4;
      console.log(game.time.fps);
      for(let i = this.values.length - 1; i > 0; i--){
        let yEnd = game.math.mapLinear(this.values[i - 1], this.lowestValue, this.highestValue, this.y + this.height, this.y);
        DAXctx.lineTo(this.x + (this.width/35) * i + xOffset, yEnd);
      }
      DAXctx.stroke();

      //draw arrow
      let sx = 0,
          sy = 0;
      if(this.values.length > 1){
        let change = this.values[this.values.length - 1] - this.values[this.values.length - 2];
        if(change > 10 || change < -10){
          sx = 32;
          sy = (change > 0)? 0 : 32;
        }
      }

      DAXctx.drawImage(this.arrowsTexture.data, sx, sy, 32, 32, this.x + this.width + 20, 20, 32, 32);
    },
  },
};

var MainGame = {
  init: function () {

  },
  create: function () {
    console.log("Loading maingame");
    DAXboard.DAXcanvas =  new Phaser.BitmapData(game, "DAXcanvas", game.width, 80)
    DAXboard.DAXimage = this.add.image(0, 0, DAXboard.DAXcanvas);
    DAXboard.init();
    DAXboard.update();
    game.time.events.loop(Phaser.Timer.SECOND, DAXboard.update, game);

    //input
    this.arrowKeys = game.input.keyboard.createCursorKeys();
  },

  update: function () {
    //update input
    if(this.arrowKeys.up.isDown)DAXboard.DAXniveau++;
    if(this.arrowKeys.down.isDown)DAXboard.DAXniveau--;


  }
}


DAXboard.update = function() {
  let DAXctx = DAXboard.DAXcanvas.context;
  DAXctx.fillStyle = DAXboard.BG_COLOR;
  DAXctx.strokeStyle = "rgb(100, 100, 100)";

  DAXctx.strokeRect(0, 0, game.width, 80);

  //update left info text
  DAXboard.leftText.update(DAXctx);
  DAXboard.chart.update(DAXctx, DAXboard.DAXniveau);
}
