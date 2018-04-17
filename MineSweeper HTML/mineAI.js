function gen_init(n, k) {
  let sa = []
  for(let i = 0; i < k; i++) {
    sa[i] = i
  }
  return sa
}

function gen_next(current, n, k) {

  //inc rightmost element
  if(current[k - 1] < n - 1) {current[k - 1]++; return current}
  let j
  for(j = k - 2; j >= 0; j--) {
    if(current[j] < n - k + j)break
  }

  if(current[0] == n - k)return null

  current[j]++

  while(j < k - 1) {
    current[j + 1] = current[j] + 1
    j++
  }
  return current


}

/**
 * @returns number[] or null
 */
function getBestSolution() {
  const possiblePlaces = []
  const discoveredPlaces = []
  for(let x = 0; x < fWidth; x++) {
    for(let y = 0; y < fHeight; y++) {
      if(!field[x][y].discovered)possiblePlaces.push({x: x, y: y, prob: 0.0})
      else if(field[x][y].state > 0) {
        discoveredPlaces.push({x: x, y: y, bombs: field[x][y].state})
      }
    }
  }

  function valid(currentfV)  {
    //check if all bombs can exist or for one discovered tile there is a bomb too moch / too less
    
    for(let dPlace of discoveredPlaces) {
      //count adjecent bombs
      let bombCounter = 0
      for(let currentBombPlace of currentfV) {
        const bomb = possiblePlaces[currentBombPlace]
        if(Math.abs(bomb.x - dPlace.x) <= 1) {
          if(Math.abs(bomb.y - dPlace.y) <= 1) {
            //bomb found
            bombCounter++
            if(bombCounter > dPlace.bombs)return false
          }
        }
      }
      if(bombCounter != dPlace.bombs)return false
    }
    return true
  }
  


  let fieldVersion = gen_init(possiblePlaces.length, bombCount)
  let possibleArrangements = 0
  console.log(possiblePlaces)
  console.log("Starting all Arrangement generation")
  while(fieldVersion != null) {
    if(valid(fieldVersion)) {
      //count bombs to fieldCounter
      possibleArrangements ++
      if(possibleArrangements % 10000000 == 0) {
        console.log(possibleArrangements)
      }
      for(let index of fieldVersion) {
        possiblePlaces[index].prob ++
      }
    }

    //gen next combination
    fieldVersion = gen_next(fieldVersion, possiblePlaces.length, bombCount)
  }

  //generate probability per cell
  if(possibleArrangements == 0)return null

  for(let cell of possiblePlaces) {
    cell.prob /= possibleArrangements
  }

  return possiblePlaces
}