let normalizedIlluminance = [];
let time = [];

function DrawChart(ys, xs) {
    const context = document.getElementById('lightGraph');
    const rightCard = document.querySelector('.card.right');
    console.log(rightCard.clientHeight);

    let config = {
        type: 'line',
        data: {
            labels: xs,
            datasets: [{
                label: 'Normalized Illuminance',
                data: ys,
                backgroundColor: '#82b1ff',
                borderColor: '#82b1ff',
                color: '#ffffff'
            }]
        },
        options: {
            aspectRatio: 2.35,
            animation: {
                duration: 0
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    },
                    ticks: {
                        fontColor: '#ffffff'
                    },
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.5)',
                    },
                    ticks: {
                        max: 180,
                        min: 0,
                        stepSize: 10,
                        color: '#ffffff',
                        fontColor: '#ffffff'
                    },
                    title: {
                        color: '#ffffff'
                    },
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

    DrawChart(normalizedIlluminance, corrected_time);
}
