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
                yAxes: [{
                    ticks: {
                        max: 100,
                        min: 0,
                        stepSize: 10
                    }
                }]
            }
        }

    }
    let c = new Chart(context, config);
}

window.addPoint = function (brightness) {
    normalizedIlluminance.push(brightness);

    var date = new Date();
    var secs = date.getTime();
    time.push(secs);

    if (normalizedIlluminance.length > 40) {
        normalizedIlluminance.shift();
        time.shift();
    }

    let corrected_time = [];

    for (let i = 0; i < time.length; i++) {
        corrected_time.push((time[i] - secs) / 1000);
    }
    console.log(corrected_time);

    DrawChart(normalizedIlluminance, corrected_time);
}
