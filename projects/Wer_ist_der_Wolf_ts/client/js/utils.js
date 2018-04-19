
function setModal(btn, modal) {
    btn.click(function() {
        console.log("Opened modal");
        modal.css({"display": "block"});
        modal.find(".close-modal").click(function () {
            console.log("closed modal");
            modal.css({"display": "none"});
        });
    });
} 