var BootState = {
  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.time.advancedTiming = true;
  },

  preload: function () {
    this.load.image("loadingscreen", "imgs/loadingscreen.png");
  },

  create: function () {
    this.game.stage.backgroundColor = "#fff";
    this.state.start("LoadingScreen");
  },
};
