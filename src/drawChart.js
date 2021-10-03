import {Chart, registerables}  from 'chart.js';

Chart.register(...registerables);

let time = 0;

let chart = null;

export const initChart = (xs, ys) => {
    const context = document.getElementById('lightGraph');
    const config = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Normalized Illuminance',
                data: []
            }]
        },
        options: {
            animation: {
                duration: 0
            }
        }
    };
    chart = new Chart(context, config);
};

export const updateChart = newValue => {
    chart.data.labels.push(++time);
    chart.data.datasets[0].data.push(newValue);
    chart.update();
};