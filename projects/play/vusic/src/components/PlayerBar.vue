/* eslint no-unused-vars: "off" */

<template>
  <div class="playerBar">
    <img class="songCover" src="../assets/123456789.jpg">
    <div class="songInfo">
      <h1>{{currentSong.name}}</h1>
      <h2>{{currentSong.artist}}</h2>
    </div>
  <div class="musicControl">
    <div class="controlButtons">
      <div class="jumpButton controlButton">
        &lt;&lt;
      </div>
      <div class="playButton controlButton" @click="togglePlay()" v-bind:class="{paused: !songIsPlaying}">
        <div class="left"></div>
        <div class="right"></div>
      </div>
      <div class="jumpButton controlButton">
        &gt;&gt;
      </div>
    </div>
    <div class="timeLine" @click="clickedTimeline">
      <div class="fullLine" id="fullLine"></div>
        <div id="playedLine" v-bind:style="{width: ((this.currentTime / this.currentSong.length)*100).toString()+'%'}"></div>
        <div class="timeButton noselect" v-bind:style="{left: ((this.currentTime / this.currentSong.length)*100).toString()+'%'}">
          {{Math.floor(this.currentTime / 60)}}:{{(this.currentTime - Math.floor(this.currentTime / 60) * 60).toFixed().padStart(2, '0')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Song } from '../Data.js'

export default {
  name: 'PlayerBar',
  data () {
    return {
      currentSong: new Song({
        name: 'Corleone',
        artist: 'RAF Camora',
        length: 220,
        published: '2017',
        infos: 'First solo song for european wide listeners',
        id: 123456789
      }),
      songIsPlaying: true,
      currentTime: 74
    }
  },

  mounted: function () {
    console.log('Mounted')
    setInterval(() => {
      if (this.songIsPlaying) this.currentTime++
    }, 1000)
  },

  methods: {
    togglePlay: function () {
      console.log('toggled play')
      this.songIsPlaying = !this.songIsPlaying
    },

    clickedTimeline: function (event) {
      const startPx = document.getElementById('fullLine').offsetLeft
      const widthPx = document.getElementById('fullLine').clientWidth
      let val = event.clientX - startPx
      val /= widthPx
      this.currentTime = this.currentSong.length * val
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.playerBar {
  max-height: 100px;
  width: 100vw;
  position: absolute;
  bottom: 0px;
  display: flex;
  background: rgb(118, 35, 242);
  background: linear-gradient(
    300deg,
    rgba(118, 35, 242, 1) 0%,
    rgba(35, 242, 204, 1) 100%
  );

  -webkit-box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.75);
}

.songCover {
  height: 200px;
  position: relative;
  left: 10px;
  bottom: 110px;
  -webkit-box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.75);
}

.songInfo {
  padding-left: 20px;
  max-width: 500px;
  margin-top: auto;
  margin-bottom: auto;
}

h1,
h2 {
  margin: 5px;
}

h1 {
  font-size: 1.7rem;
}
h2 {
  font-size: 1.3rem;
}

.musicControl {
  margin: 5px 40px;
  width: auto;
  flex-grow: 3;
}

.controlButtons {
  height: 50px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.controlButtons .playButton {
  width: 40px;
  height: 40px;
}

.jumpButton {
  width: 35px;
  height: 35px;
  line-height: 35px;
}

.controlButton {
  margin: 0px 5px 0px 5px;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.1s ease-in-out;
  color: rgba(255, 255, 255, 0.3);
}

.controlButton:hover {
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.5);
}

.playButton .left,
.playButton .right {
  width: 2px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.1s ease-in-out;
  position: relative;
  left: -2px;
  top: -2px;
}

.playButton .left {
  transform: translate(14.66px, 12px);
  /* transform: translate(0px, 0px); */
}

.playButton .right {
  transform: translate(27.33px, -8px);
  /* transform: translate(0px, 0px); */
}

.playButton.paused .left {
  transform: translate(23px, 5px) rotate(-50deg);
}

.playButton.paused .right {
  transform: translate(23px, -2px) rotate(50deg);
}

.playButton:hover .left,
.playButton:hover .right {
  background-color: rgba(255, 255, 255, 0.5);
}

.timeLine {
  width: 100%;
  height: 12px;
}

.timeLine .fullLine {
  position: relative;
  top: 4px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
}

.timeLine #playedLine {
  position: relative;
  background-color: rgba(255, 255, 255, 0.6);
  display: block;
  height: 4px;
  width: 0%;
}

.timeLine .timeButton {
  background-color: white;
  width: 20px;
  height: 20px;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
  top: -12px;
  left: 100%;
  color: transparent;
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
}

.timeLine .timeButton:hover {
  color: rgb(50, 50, 50);
  width: 40px;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>
