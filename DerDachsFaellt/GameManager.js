var game = null;



var World = {
  headerSprite: null,
  leftSprites: [],
  rightSprites: [],
  backSprite: null,
  pos: 0,
  speed: 0,

  states: {MENU: 1, INTRO: 2, PLAYING: 3},
  state: 1,

  init: function () {
    this.headerSprite = game.add.image(0, 70, "boerse");
    MainGame.Boerse_group.add(this.headerSprite);
    let leftSprite = game.add.image(0, 200, "border 1");
    this.leftSprites.push(leftSprite);
    MainGame.Sides_group.add(leftSprite);

    let rightSprite = game.add.image(game.width - 30, 200, "border 1");
    rightSprite.anchor.setTo(1, .5);
    rightSprite.scale.x = -1;
    this.rightSprites.push(rightSprite);
    MainGame.Sides_group.add(rightSprite);
  },

  update: function () {

    if(this.state == this.states.INTRO){
      if(this.pos < 90){
        this.speed = (92 - this.pos) * 0.02;

      }
      else{
        this.state = this.states.PLAYING;
        console.log("Switched Worldstate to PLAYING");
        this.speed = 0;
      }
    }


    this.pos += this.speed;

    if(this.headerSprite != null){
      this.headerSprite.y = 70 - this.pos;

    }

    let removeSprite = -1;

    for(let i = 0; i < this.leftSprites.length; i++){
      let sprite = this.leftSprites[i];
      sprite.y -= this.speed;

      if(sprite.y < -100){
        removeSprite = i;
      }
    }
    if(removeSprite > -1){
      this.leftSprites[removeSprite].destroy();
      this.leftSprites.splice(removeSprite, 1);
      //add new texture
    }

    removeSprite = -1;
    //reset for right sprites

    for(let i = 0; i < this.rightSprites.length; i++){
      let sprite = this.rightSprites[i];
      sprite.y -= this.speed;

      if(sprite.y < -100){
        removeSprite = i;
      }
    }
    if(removeSprite > -1){
      this.rightSprites[removeSprite].destroy();
      this.rightSprites.splice(removeSprite, 1);
      //add new texture
    }

    if(Dachs.fixed){
      Dachs.sprite.y -= this.speed;
    }
  },
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
    height: 50,
    counter: 0,
    init: function (DAXctx) {
      //fill left side
      DAXctx.fillStyle = this.BG_COLOR;
      DAXctx.fillRect(1, 1, this.width + 19, 68);

      for(let i = 0; i < this.height/2; i++){
        this.update(DAXctx, true);
      }

    },
    update: function (DAXctx) {
      this.counter++;
      //shift image data up 2
      let imageData = DAXctx.getImageData(this.x, this.y + 2, this.width, this.height);

      //fill left side
      DAXctx.fillRect(1, 1, this.width + 19, 68);

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
    height: 50,
    values: [],
    lowestValue: 1000000,
    highestValue: -1000000,
    update: function (DAXctx, newValue) {

      //add new data to values, delete last if necessary
      this.values.push(newValue);
      if(this.values.length > 35)this.values.splice(0, 1);



      //update lowestValue, highestValue
      this.lowestValue = 1000000;
      this.highestValue = -1000000;
      this.values.forEach(function (entry) {

        if(entry > DAXboard.chart.highestValue)DAXboard.chart.highestValue = entry;
        if(entry < DAXboard.chart.lowestValue)DAXboard.chart.lowestValue = entry;

      });

      //overdraw area
      DAXctx.fillStyle = DAXboard.BG_COLOR;
      DAXctx.fillRect(80, 1, game.width - 81, 68);

      DAXctx.strokeStyle = "rgb(255, 255, 255)";
      DAXctx.lineWidth = 1;
      //Draw data
      DAXctx.beginPath();
      let yStart =
      game.math.mapLinear(this.values[this.values.length - 1], this.lowestValue, this.highestValue, this.y + this.height, this.y);
      DAXctx.moveTo(this.x + this.width, yStart);
      let xOffset = (35 - this.values.length) * 4;

      for(let i = this.values.length - 1; i > 0; i--){
        let yEnd = game.math.mapLinear(this.values[i - 1], this.lowestValue, this.highestValue, this.y + this.height, this.y);
        DAXctx.lineTo(this.x + (this.width/35) * i + xOffset, yEnd);
      }
      DAXctx.stroke();

      //draw arrow
      let sx = 0,
          sy = 0,
          change = 0;
      if(this.values.length > 1){
        change = this.values[this.values.length - 1] - this.values[this.values.length - 2];
        if(change > 10 || change < -10){
          sx = 32;
          sy = (change > 0)? 0 : 32;
        }
      }

      DAXctx.drawImage(this.arrowsTexture.data, sx, sy, 32, 32, this.x + this.width + 20, 20, 32, 32);
      let changePerc = (change / this.values[this.values.length - 1]) * 100;
      DAXctx.fillStyle = DAXctx.strokeStyle;
      DAXctx.fillText(changePerc.toFixed(2)+"%", this.x + this.width + 70, 20);
      DAXctx.fillText(DAXboard.DAXniveau, this.x + this.width + 70, 35);
    },
  },
};

var Dachs = {
  sprite: null,
  states: {
    IDLE: 0,
    WALKING: 1,
    FALLING: 2,
    CUTTING: 3,
    ELECTRO: 4,
    DEAD: 5,
  },
  state: 0,
  fixed: true,
  init: function () {
    this.sprite = game.add.sprite(100, 200, "dachs", "dachs base");
    MainGame.Dachs_group.add(this.sprite);
    //create the animation for walking using the frame names we want from max.json
    this.sprite.animations.add('idle', [
        "dachs base",
        "dachs idle 2",
    ], 1, true, false);

    this.sprite.animations.add('walk', [
        "dachs base",
        "dachs step",
        "dachs step 2",
    ], 3, true, false);

    this.sprite.animations.add('electro', [
        "dachs electro 1",
        "dachs electro 2",
        "dachs electro 3",
    ], 2, true, false);

  },
  update: function () {
    switch (this.state) {
      case this.states.IDLE:
        this.sprite.animations.play("idle");
        break;
      case this.states.WALKING:
        this.sprite.animations.play("walk");
        break;
      case this.states.ELECTRO:
        this.sprite.animations.play("electro");
        break;
      default:
        this.sprite.animations.play("idle");
    }

  },
};

var MainGame = {
  button: null,
  init: function () {

  },
  create: function () {
    console.log("Loading maingame");


    console.log("Init layers");
    this.BG_group = game.add.group();
    this.Sides_group = game.add.group();
    this.Boerse_group = game.add.group();
    this.Dachs_group = game.add.group();
    this.Cable_group = game.add.group();
    this.UI_group = game.add.group();

    console.log("Init World");
    World.init();

    console.log("Init Dachs");
    Dachs.init();

    console.log("Init DAXboard");
    DAXboard.DAXcanvas =  new Phaser.BitmapData(game, "DAXcanvas", game.width, 70)
    DAXboard.DAXimage = this.add.image(0, 0, DAXboard.DAXcanvas);
    this.UI_group.add(DAXboard.DAXimage);
    DAXboard.init();
    DAXboard.update();
    game.time.events.loop(Phaser.Timer.SECOND, DAXboard.update, game);

    //input
    this.arrowKeys = game.input.keyboard.createCursorKeys();

    //MENU
    this.button = game.add.button(game.width/2, game.height/2, "button play", this.startGame);
    this.UI_group.add(this.button);
  },

  startGame: function () {
    World.pos = 0;
    World.state = World.states.INTRO;
    console.log("restarting game");
    MainGame.button.visible = false;
  },

  update: function () {
    //update input
    if(this.arrowKeys.up.isDown)DAXboard.DAXniveau++;
    if(this.arrowKeys.down.isDown)DAXboard.DAXniveau--;

    Dachs.update();
    World.update();
  },
};


DAXboard.update = function() {
  let DAXctx = DAXboard.DAXcanvas.context;
  DAXctx.fillStyle = DAXboard.BG_COLOR;
  DAXctx.strokeStyle = "rgb(100, 100, 100)";

  DAXctx.strokeRect(0, 0, game.width, 80);

  //update left info text
  DAXboard.leftText.update(DAXctx);
  DAXboard.chart.update(DAXctx, DAXboard.DAXniveau);
}

function init() {
  game = new Phaser.Game(192*2, 108*2, Phaser.CANVAS, "", null, false, false);

  game.state.add("BootState", BootState);
  game.state.add("LoadingScreen", LoadingScreen);
  game.state.add("MainGame", MainGame);
  game.state.start("BootState");
};
