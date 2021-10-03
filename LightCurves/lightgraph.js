let normalizedIlluminance = [];
let time = [];


function DrawChart(ys, xs) {
    var context = document.getElementById('lightGraph');

    let config = {
        type: 'line',
        data: {
            labels: xs,
            datasets: [{
                label: 'Normalized Illuminance',
                data: ys
            }]
        },
        options: {
            animation: {
                        duration: 0
                    },
            scales: {
                y: {
                    min: 0,
                    max: 100
                }
            }
        }

    }
    let c = new Chart(context, config);
    c.options.scales[y].max = 100;
    c.options.scales[y].min = 0;

}

window.addPoint= function (brightness){
    normalizedIlluminance.push(brightness);

    var date = new Date();
    var secs = date.getTime();
    time.push(secs);

    if (normalizedIlluminance.length>40){
        normalizedIlluminance.shift();
        time.shift();
    }

    let corrected_time = [];

    for (let i = 0; i < time.length; i++){
        corrected_time.push((time[i] - secs)/1000);
    }
    console.log(corrected_time);

    DrawChart(normalizedIlluminance,corrected_time);
    }
