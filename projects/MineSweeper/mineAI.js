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

  if(j < 0) {return null}

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
  let fieldCounter = []
  for(let i = 0; i < f_width * f_height; i++)fieldCounter.push(0)
  const discoveredField = []
  for(let x = 0; x < f_width; x++) {
    for(let y = 0; y < f_height; y++) {
      if(field[x][y].discovered)discoveredField[x + y * f_width] = true
      else discoveredField[x + y * f_width] = false
    }
  }
  function valid(current) {
    for(let i = 0; i < current.length; i++) {
      if(current[i] > 0 && discoveredField[i])return false
    }
    return true
  }
  


  let fieldVersion = gen_init(f_width * f_height, bombcount)
  let possibleArrangements = 0
  console.log("Starting all Arrangement generation")
  let trys = 0
  while(fieldVersion != null) {
    if(valid(fieldVersion)){
      //count bombs to fieldCounter
      possibleArrangements ++
      if(possibleArrangements % 1000 == 0) {
        console.log(possibleArrangements)
      }
      for(let index of fieldVersion) {
        fieldCounter[index] ++
      }

    }

    //gen next combination
    gen_next(fieldVersion, f_width * f_height, bombcount)

    trys ++
    if(trys % 1000000 == 0)console.log(trys)
  }

  //generate probability per cell
  if(possibleArrangements == 0)return null

  for(let i = 0; i < fieldCounter.length; i++) [
    fieldCounter[i] /= possibleArrangements
  ]

  return possibleArrangements
}