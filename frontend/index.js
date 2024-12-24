document.addEventListener('DOMContentLoaded', function() {
    // 更新最新开奖信息
    function updateLatestDraw() {
        const latestDraw = historyData.drawHistory[0];
        const dateElem = document.querySelector('.draw-date');
        dateElem.textContent = `第${latestDraw.period}期 开奖日期：${latestDraw.date}`;

        // 更新号码
        const redBalls = document.querySelectorAll('.latest-draw .red-balls .ball');
        const blueBall = document.querySelector('.latest-draw .blue-balls .ball');
        
        latestDraw.redBalls.forEach((num, index) => {
            redBalls[index].textContent = num.toString().padStart(2, '0');
        });
        blueBall.textContent = latestDraw.blueBall.toString().padStart(2, '0');
    }

    // 更新历史开奖记录
    function updateHistoryTable(limit = 10) {
        const tbody = document.getElementById('historyTableBody');
        const history = historyData.drawHistory.slice(0, limit);

        tbody.innerHTML = history.map(draw => `
            <tr>
                <td>${draw.period}</td>
                <td>${draw.date}</td>
                <td>
                    ${draw.redBalls.map(num => 
                        `<span class="ball red small">${num.toString().padStart(2, '0')}</span>`
                    ).join('')}
                    <span class="ball blue small">${draw.blueBall.toString().padStart(2, '0')}</span>
                </td>
                <td>¥ ${formatMoney(draw.poolAmount || 0)}</td>
            </tr>
        `).join('');
    }

    // 格式化金额
    function formatMoney(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 监听历史记录筛选
    document.getElementById('historyRange').addEventListener('change', async function(e) {
        const limit = parseInt(e.target.value);
        const data = await dataUpdater.fetchHistoryData(limit);
        if (data) {
            historyData.drawHistory = data;
            updateHistoryTable();
            updateStatistics();
        }
    });

    // 更新奖池信息
    function updatePrizePool() {
        const poolAmount = document.getElementById('poolAmount');
        const poolTrend = document.getElementById('poolTrend');
        const stats = historyData.prizeStats;

        poolAmount.textContent = `¥ ${formatMoney(stats.totalPrizePool / 100000000)}亿`;
        poolTrend.textContent = `${stats.trend.direction === 'up' ? '↑' : '↓'} 较上期${
            stats.trend.direction === 'up' ? '增长' : '下降'
        }${stats.trend.percentage}%`;
        poolTrend.className = `stat-trend ${stats.trend.direction}`;
    }

    // 更新中奖情况
    function updatePrizeInfo() {
        const latestDraw = historyData.drawHistory[0];
        const prizes = latestDraw.prizes;

        document.getElementById('firstPrizeCount').textContent = `${prizes.first.count}注`;
        document.getElementById('firstPrizeAmount').textContent = `${formatMoney(prizes.first.amount / 10000)}万/注`;
        document.getElementById('secondPrizeCount').textContent = `${prizes.second.count}注`;
        document.getElementById('secondPrizeAmount').textContent = `${formatMoney(prizes.second.amount / 10000)}万/注`;
    }

    // 更新号码分析
    function updateNumberAnalysis() {
        const stats = historyData.statistics;
        
        // 更新热号
        const hotNumbers = document.getElementById('hotNumbers');
        hotNumbers.innerHTML = stats.redBalls.temperature.hot
            .map(num => `<span class="ball red small">${num.toString().padStart(2, '0')}</span>`)
            .join('') +
            stats.blueBalls.temperature.hot
                .map(num => `<span class="ball blue small">${num.toString().padStart(2, '0')}</span>`)
                .join('');

        // 更新冷号
        const coldNumbers = document.getElementById('coldNumbers');
        coldNumbers.innerHTML = stats.redBalls.temperature.cold
            .map(num => `<span class="ball red small">${num.toString().padStart(2, '0')}</span>`)
            .join('') +
            stats.blueBalls.temperature.cold
                .map(num => `<span class="ball blue small">${num.toString().padStart(2, '0')}</span>`)
                .join('');
    }

    // 创建区间分布图表
    function createRangeChart() {
        const ctx = document.getElementById('rangeChart').getContext('2d');
        const stats = historyData.statistics.redBalls.ranges;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1-11区间', '12-22区间', '23-33区间'],
                datasets: [{
                    label: '出现次数',
                    data: [stats['1-11'].count, stats['12-22'].count, stats['23-33'].count],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '红球区间分布统计'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                const percentage = Object.values(stats)[context.dataIndex].percentage;
                                return `${label}: ${value} (${percentage})`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '出现次数'
                        }
                    }
                }
            }
        });
    }

    // 创建奇偶比例图表
    function createOddEvenChart() {
        const ctx = document.getElementById('oddEvenChart').getContext('2d');
        const redStats = historyData.statistics.redBalls.oddEven;
        const blueStats = historyData.statistics.blueBalls.oddEven;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['红球奇数', '红球偶数', '蓝球奇数', '蓝球偶数'],
                datasets: [{
                    data: [
                        redStats.odd.count,
                        redStats.even.count,
                        blueStats.odd.count,
                        blueStats.even.count
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '红蓝球奇偶比例'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const stats = context.dataIndex < 2 ? redStats : blueStats;
                                const percentage = context.dataIndex % 2 === 0 
                                    ? stats.odd.percentage 
                                    : stats.even.percentage;
                                return `${label}: ${value} (${percentage})`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 初始化页面
    updateLatestDraw();
    updateHistoryTable();
    updatePrizePool();
    updatePrizeInfo();
    updateNumberAnalysis();

    // 创建图表
    createRangeChart();
    createOddEvenChart();

    // 监听分布分析标签切换
    document.querySelectorAll('.distribution-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.distribution-chart').forEach(c => c.classList.add('hidden'));
            this.classList.add('active');
            document.getElementById(`${tabType}Chart`).classList.remove('hidden');
            
            // 触发图表重绘以修复可能的显示问题
            if (tabType === 'range') {
                createRangeChart();
            } else if (tabType === 'oddEven') {
                createOddEvenChart();
            }
        });
    });
}); 