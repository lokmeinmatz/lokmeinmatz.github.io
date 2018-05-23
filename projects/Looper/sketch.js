
let mic, recorder
let looper

let tracks = []
let MAX_TRACKS = 4
let metronome, clap
let metronomeActive = true

function preload() {
  clap = loadSound('clap.wav')
}
class Track {
  constructor() {
    this.soundFile = new p5.SoundFile()
    this.graphic = createGraphics(80 * 4 * BARS, 64)
    this.graphic.background(0)
    this.recording = false
    this.requestRecord = false
    this.requestWaveRedraw = false
  }

  updateWaveForm() {
    const cbuf = this.soundFile.buffer.getChannelData(0)
    this.graphic.background(0)
    this.graphic.stroke(255)

    //get biggest value
    const biggest = cbuf.reduce((a, b) => {return (a > b)? a : b})
    const scale = 1 / (biggest + 0.001)
    console.log(biggest)
    for(let x = 0; x < this.graphic.width; x++) {
      //sample data
      const val1 = cbuf[floor(map(x, 0, this.graphic.width, 0, cbuf.length))] * scale
      const val2 = cbuf[floor(map(x, 0, this.graphic.width, 0, cbuf.length)) + 1] * scale
      const val3 = cbuf[floor(map(x, 0, this.graphic.width, 0, cbuf.length)) - 1] * scale
      const val = (val1 + val2 + val3) / 3
      this.graphic.line(x, 32, x, 32 + val * 32)
    }
  }
}


const BPM = 120
const BARS = 2
const LOOPLENGTH = (60 / BPM) * 4 * BARS
console.log('Looplength: ', LOOPLENGTH)
let startTime = 0
function setup() {
  createCanvas(1000, 500)
  for(let i = 0; i < MAX_TRACKS; i++) {
    tracks[i] = new Track()
  }
  clap.setVolume(0.2)
  metronome = new p5.SoundLoop((time) => {
    clap.play(time)
  }, (60 / BPM))
  //metronome.maxIterations = 8

  mic = new p5.AudioIn()
  mic.start()

  recorder = new p5.SoundRecorder()

  recorder.setInput(mic)

  looper = new p5.SoundLoop((time) => {

    if(!metronomeActive) {
      metronome.stop(time)
    }
    else {
      metronome.start(time)
      //metronome.maxIterations = 8
    }
    if(recorder.recording) {
      recorder.stop()
      console.log('Stopped recording')


      //find recorded track
      let recTrack = tracks.find(t => t.recording)
      //draw file
      if(recTrack){
        recTrack.requestWaveRedraw = true
        recTrack.recording = false
      }
    }

    for(let track of tracks) {
 
      if(track.soundFile.isLoaded()){
        track.soundFile.play(time)
      }
      if(track.requestRecord && mic.enabled) {
        //shedule record to start
        setTimeout(() => {
          track.requestRecord = false
          console.log('recording track')
          recorder.record(track.soundFile)
          track.recording = true
        }, time * 1000.0)
      }
    }
    
    startTime = new Date() / 1000.0
  }, (60 / BPM) * 4 * BARS)

  metronome.syncedStart(looper)

  //looper.bpm = BPM / (4 * BARS)
  looper.start()
  startTime = new Date() / 1000.0
}


function draw() {

  let elapsedTime = new Date() / 1000.0 - startTime
  //console.log(elapsedTime)

  background(30)
  stroke(255)
  for(let bar = 0; bar < BARS; bar++) {
    //Draw bars
    for(let i = 0; i < 4; i++) {
      const x = 100 + ((bar*4) + i) * 80
      line(x, 10, x, (i == 0)?100: 50)
    }
  }
  line(100 + 2 * 4 * 80, 10, 100 + 2 * 4 * 80, 100)

  //draw tracks
  fill(255)
  noStroke()
  for(let trackID = 0; trackID < MAX_TRACKS; trackID++) {
    const track = tracks[trackID]

    if(track.requestWaveRedraw){
      track.requestWaveRedraw = false
      track.updateWaveForm()
      console.log('redrawing '+trackID)
    }
    //Draw wave
    //draw track
    if(track.requestRecord) fill(200, 200, 50)
    else if(track.recording) fill(50, 255, 10)
    else fill(50)
    rect(38, 150 + trackID* 74 + 13, 32, 32)
    fill(255)
    text((trackID + 1).toString(), 50, 150 + trackID* 74 + 32)

    image(track.graphic, 100, 150 + trackID* 74)

  }
  

  //calc play position
  let playX = 100 + ((elapsedTime / 60) * BPM) * 80 
  stroke(255, 100, 10)
  line(playX, 10, playX, height - 10)
  


}


function keyPressed() {

  for(let trackID = 0; trackID < MAX_TRACKS; trackID++) {
    if(key == (trackID + 1).toString()) {
      tracks[trackID].requestRecord = !tracks[trackID].requestRecord
    }
  }
  if(key == 'M')metronomeActive = !metronomeActive

}