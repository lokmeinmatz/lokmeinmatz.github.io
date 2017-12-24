let socket;
function onload() {
    $("#side-menu").slideUp();
    $("#open-side").click(function(){
        $("#side-menu").slideToggle();
    });

    //Popup GameID
    setModal($(".btn-gameID"), $("#gameID-modal"));
    
    socket = io();

}