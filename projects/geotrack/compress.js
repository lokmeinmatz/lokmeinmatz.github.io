const fs = require('fs')

const ind = require('./Standortverlauf.json')


let out = []


for (loc of ind.locations) {
  if(!loc.latitudeE7 || !loc.longitudeE7 || !loc.accuracy || !loc.altitude || !loc.timestampMs) continue

  out.push({
    s: loc.timestampMs.slice(0, -3),
    lat: loc.latitudeE7,
    lon: loc.longitudeE7,
    acc: loc.accuracy,
    alt: loc.altitude
  })
}

fs.writeFileSync("compressedLoc.json", JSON.stringify(out) + "\n")