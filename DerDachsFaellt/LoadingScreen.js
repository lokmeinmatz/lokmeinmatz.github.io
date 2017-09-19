var LoadingScreen = {
  preload: function () {
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "loadingscreen");
    this.logo.anchor.setTo(0.5);
    console.log("Loading resources...");

    //load resources
    //---------------------------------
    this.load.image("arrows", "imgs/arrow.png");

    //load dachs texture array
    this.load.atlasJSONArray("dachs", "imgs/dachs/dachs_sprite.png", "imgs/dachs/dachs_sprite.json");

    this.load.image("boerse", "imgs/boerse.png");
    this.load.image("button play", "imgs/bttn play.png");

    this.load.image("border 1", "imgs/border_1.png");

    //---------------------------------


  },
  create: function () {
    this.logo.destroy();
    this.state.start("MainGame");
    console.log("Loaded all resources!");
  }
};
