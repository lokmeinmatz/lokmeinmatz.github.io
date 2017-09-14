var LoadingScreen = {
  preload: function () {
    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, "loadingscreen");
    this.logo.anchor.setTo(0.5);
    console.log("Loading resources...");

    //load resources
    //---------------------------------
    this.load.image("arrows", "imgs/arrow.png");

    //---------------------------------
    console.log("Loaded all resources!");
    this.logo.destroy();
    this.state.start("MainGame");
  },
};
