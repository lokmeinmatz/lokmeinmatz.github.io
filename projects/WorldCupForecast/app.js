/**
 * @type {Array<{team1: String, team2: String, points1: Number, points2: Number}>}
 */
let wholeData



function addTeam(team) {
  if(!app.allTeams.includes(team)) app.allTeams.push(team)
}

fetch('./allWorldCups.json').then(r => {
  return r.json()
}).then(j => wholeData = j).then(() => {
  for(let game of wholeData) {
    addTeam(game.team1)
    addTeam(game.team2)
  }
  app.allTeams.sort((a, b) => a > b)
  //console.log(allTeams)
})

/**
 * 
 * @param {{team1: String, team2: String, points1: Number, points2: Number}} match 
 * @param {String} teamname 
 * @returns {Number}
 */
function getPoints(match, teamname) {
  if(match.team1 == teamname) return match.points1
  return match.points2
}

const app = new Vue({
  el: '#app',
  data: {
    allTeams: [],
    team1: '',
    team2: ''
  },
  computed: {
    allAvailableTeams1(){
      if(this.team2.length == 0)return this.allTeams
      return this.allTeams.filter(e=>e!=this.team2)
    }, 
    allAvailableTeams2(){
      if(this.team1.length == 0)return this.allTeams
      return this.allTeams.filter(e=>e!=this.team1)
    },
    BothGames() {
      let matches = []
      if(this.team1 == '' || this.team2 == '')return 'Select teams'

      for(let match of wholeData) {
        if(match.team1 == this.team1 || match.team2 == this.team1) {
          if(match.team1 == this.team2 || match.team2 == this.team2) {
            //match with both teams
            matches.push(match)
          }
        }
      }
      //return matches
      let possibleEndings = new Map()
      for(let match of matches) {
        const str = getPoints(match, this.team1).toString() + '-' + getPoints(match, this.team2).toString()
        if(possibleEndings.has(str)) {
          possibleEndings.set(str, possibleEndings.get(str) + 1)
        }
        else {
          possibleEndings.set(str, 1)
        }
      }
      /**
       * @type {Array<[String, Number]>}
       */
      let pRa = []

      possibleEndings.forEach((v, k) => {
        pRa.push([k, v])
      })
      pRa.sort((a, b) => a[1] < b[1])

      //avg
      let avg1 = 0
      let avg2 = 0
      for(let s of pRa) {
        const spl = s[0].split('-')
        avg1 += parseInt(spl[0])
        avg2 += parseInt(spl[1])
      }
      const gameCount = pRa.reduce((p, c) => {
        return p + c[1]
      }, 0)
      avg1 /= gameCount
      avg2 /= gameCount

      let answer = `Avg score: ${avg1.toFixed(2)}-${avg2.toFixed(2)}`


      
      answer += ` --- Most recurring score: ${pRa[0][0]} (${pRa[0][1]} times) --- `
      answer += pRa
      

      return answer
    }
  }
})
