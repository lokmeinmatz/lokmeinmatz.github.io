let terminal
function init() {
  console.log('loading completed')
  let termElmt = document.getElementById("terminal")
  if(termElmt.requestFullscreen) {
    termElmt.requestFullscreen()
  }
  terminal = new webTerminal(termElmt)

  terminal.updateFn = update
}




function update() {
  
  //terminal.clear("#000000", "#31A83A")


  terminal.displayString("Windows 11", 0, 0)


  //taskbar
  
}