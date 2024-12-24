document.addEventListener('DOMContentLoaded', function() {
    // 红球频率图表
    const redCtx = document.getElementById('redBallChart').getContext('2d');
    new Chart(redCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(historyData.redBallStats),
            datasets: [{
                label: '出现次数',
                data: Object.values(historyData.redBallStats),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '红球出现频率统计'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 蓝球频率图表
    const blueCtx = document.getElementById('blueBallChart').getContext('2d');
    new Chart(blueCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(historyData.blueBallStats),
            datasets: [{
                label: '出现次数',
                data: Object.values(historyData.blueBallStats),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '蓝球出现频率统计'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 添加奇偶比例图表
    const oddEvenCtx = document.getElementById('oddEvenChart').getContext('2d');
    new Chart(oddEvenCtx, {
        type: 'pie',
        data: {
            labels: ['奇数', '偶数'],
            datasets: [{
                data: [
                    historyData.oddEvenStats.red.odd,
                    historyData.oddEvenStats.red.even
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '红球奇偶比例'
                }
            }
        }
    });

    // 添加区间分布图表
    const rangeCtx = document.getElementById('rangeChart').getContext('2d');
    new Chart(rangeCtx, {
        type: 'doughnut',
        data: {
            labels: ['1-11', '12-22', '23-33'],
            datasets: [{
                data: Object.values(historyData.rangeStats),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '红球区间分布'
                }
            }
        }
    });
}); 