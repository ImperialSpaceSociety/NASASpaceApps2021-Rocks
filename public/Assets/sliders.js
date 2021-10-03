function slider_change(outID, inID){
    document.getElementById(outID).innerHTML =
        (parseFloat(document.getElementById(inID).value) / 1000 - 0.5).toPrecision(2) + " rad/s";
    }