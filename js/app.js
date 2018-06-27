$(document).ready(function() {
  console.log('Loaded')

  let header = $('header')
  let main = $('main')

  $(window).scroll(() => {
    let scrollTop = $(window).scrollTop()
    let height = Math.max(window.innerHeight - scrollTop, 100)
    header.css('height', height + 'px')
  })
})
