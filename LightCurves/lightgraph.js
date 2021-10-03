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
            }
        }

    }

    let c = new Chart(context, config);
}