// 图表实例
let redBallChart = null;
let blueBallChart = null;

// 图表配置
const chartConfig = {
    // 频率分析图表配置
    frequency: {
        type: 'bar',
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
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
    },
    // 奇偶分布图表配置
    oddEven: {
        type: 'pie',
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    },
    // 走势分析图表配置
    trend: {
        type: 'line',
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 35,
                    title: {
                        display: true,
                        text: '号码'
                    }
                }
            }
        }
    },
    blueTrend: {
        type: 'line',
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: 17,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: '号码'
                    }
                }
            }
        }
    }
};

// 工具函数
const utils = {
    // 创建图表
    createChart: (ctx, config) => {
        return new Chart(ctx, config);
    },

    // 格式化日期
    formatDate: (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', config.dateFormat);
    },

    // 计算遗漏值
    calculateMissing: (numbers, allDraws) => {
        const missing = {};
        const lastAppearance = {};
        
        // 初始化
        numbers.forEach(num => {
            missing[num] = 0;
            lastAppearance[num] = null;
        });

        // 计算遗漏值
        allDraws.forEach((draw, index) => {
            numbers.forEach(num => {
                if (!lastAppearance[num] && draw.includes(num)) {
                    lastAppearance[num] = index;
                }
            });
        });

        // 计算当前遗漏值
        const currentIndex = allDraws.length;
        numbers.forEach(num => {
            missing[num] = lastAppearance[num] ? currentIndex - lastAppearance[num] : currentIndex;
        });

        return missing;
    },

    // 计算奇偶比例
    calculateOddEvenRatio: (numbers) => {
        const odd = numbers.filter(n => n % 2 === 1).length;
        const even = numbers.filter(n => n % 2 === 0).length;
        return `${odd}:${even}`;
    },

    // 计算大小比例
    calculateSizeRatio: (numbers, midPoint) => {
        const small = numbers.filter(n => n <= midPoint).length;
        const large = numbers.filter(n => n > midPoint).length;
        return `${small}:${large}`;
    },

    // 计算奇偶数据
    calculateOddEvenData: (numbers) => {
        return {
            odd: numbers.filter(n => n % 2 === 1).length,
            even: numbers.filter(n => n % 2 === 0).length
        };
    },

    // 处理走势数据
    processTrendData: (historyData) => {
        const periods = historyData.map(item => item.期号);
        const redBalls = Array(33).fill().map((_, i) => {
            const number = (i + 1).toString().padStart(2, '0');
            return {
                label: number,
                data: historyData.map(item => item.红球.includes(number) ? i + 1 : null)
            };
        });
        const blueBalls = Array(16).fill().map((_, i) => {
            const number = (i + 1).toString().padStart(2, '0');
            return {
                label: number,
                data: historyData.map(item => item.蓝球 === number ? i + 1 : null)
            };
        });
        return { periods, redBalls, blueBalls };
    }
};

// 数据处理函数
const dataHandler = {
    // 从历史数据计算频率数据
    calculateFrequencyFromHistory: (historyData) => {
        const redBallFrequency = {};
        const blueBallFrequency = {};

        // 初始化频率对象
        for (let i = 1; i <= 33; i++) {
            const num = i.toString().padStart(2, '0');
            redBallFrequency[num] = 0;
        }
        for (let i = 1; i <= 16; i++) {
            const num = i.toString().padStart(2, '0');
            blueBallFrequency[num] = 0;
        }

        // 统计频率
        historyData.forEach(item => {
            item.红球.forEach(num => {
                redBallFrequency[num]++;
            });
            blueBallFrequency[item.蓝球]++;
        });

        return { redBallFrequency, blueBallFrequency };
    },

    // 处理频率数据
    processFrequencyData: (data) => {
        const { redBallFrequency, blueBallFrequency } = data;

        // 处理红球数据
        const redLabels = Object.keys(redBallFrequency).sort((a, b) => parseInt(a) - parseInt(b));
        const redData = redLabels.map(label => redBallFrequency[label]);

        // 处理蓝球数据
        const blueLabels = Object.keys(blueBallFrequency).sort((a, b) => parseInt(a) - parseInt(b));
        const blueData = blueLabels.map(label => blueBallFrequency[label]);

        return {
            red: { labels: redLabels, data: redData },
            blue: { labels: blueLabels, data: blueData }
        };
    },

    // 更新图表
    updateCharts: (data, dimension) => {
        const redCtx = document.getElementById('red-ball-chart').getContext('2d');
        const blueCtx = document.getElementById('blue-ball-chart').getContext('2d');

        // 如果图表已存在，销毁它们
        if (redBallChart) redBallChart.destroy();
        if (blueBallChart) blueBallChart.destroy();

        switch (dimension) {
            case 'frequency':
                // 频率分析图表
                const frequencyData = dataHandler.processFrequencyData(data);
                redBallChart = new Chart(redCtx, {
                    type: chartConfig.frequency.type,
                    data: {
                        labels: frequencyData.red.labels,
                        datasets: [{
                            label: '红球出现次数',
                            data: frequencyData.red.data,
                            backgroundColor: 'rgba(220, 53, 69, 0.5)',
                            borderColor: 'rgb(220, 53, 69)',
                            borderWidth: 1
                        }]
                    },
                    options: chartConfig.frequency.options
                });

                blueBallChart = new Chart(blueCtx, {
                    type: chartConfig.frequency.type,
                    data: {
                        labels: frequencyData.blue.labels,
                        datasets: [{
                            label: '蓝球出现次数',
                            data: frequencyData.blue.data,
                            backgroundColor: 'rgba(13, 110, 253, 0.5)',
                            borderColor: 'rgb(13, 110, 253)',
                            borderWidth: 1
                        }]
                    },
                    options: chartConfig.frequency.options
                });
                break;

            case 'oddEven':
                // 奇偶分布图表
                const redNumbers = Object.keys(data.redBallFrequency).map(num => parseInt(num));
                const blueNumbers = Object.keys(data.blueBallFrequency).map(num => parseInt(num));
                
                const redOddEven = utils.calculateOddEvenData(redNumbers);
                const blueOddEven = utils.calculateOddEvenData(blueNumbers);

                redBallChart = new Chart(redCtx, {
                    type: chartConfig.oddEven.type,
                    data: {
                        labels: ['奇数', '偶数'],
                        datasets: [{
                            data: [redOddEven.odd, redOddEven.even],
                            backgroundColor: [
                                'rgba(220, 53, 69, 0.5)',
                                'rgba(220, 53, 69, 0.8)'
                            ]
                        }]
                    },
                    options: chartConfig.oddEven.options
                });

                blueBallChart = new Chart(blueCtx, {
                    type: chartConfig.oddEven.type,
                    data: {
                        labels: ['奇数', '偶数'],
                        datasets: [{
                            data: [blueOddEven.odd, blueOddEven.even],
                            backgroundColor: [
                                'rgba(13, 110, 253, 0.5)',
                                'rgba(13, 110, 253, 0.8)'
                            ]
                        }]
                    },
                    options: chartConfig.oddEven.options
                });
                break;

            case 'trend':
                // 走势分析图表
                const trendData = utils.processTrendData(data);
                
                redBallChart = new Chart(redCtx, {
                    type: chartConfig.trend.type,
                    data: {
                        labels: trendData.periods,
                        datasets: trendData.redBalls.map(ball => ({
                            label: ball.label,
                            data: ball.data,
                            borderColor: `rgba(220, 53, 69, ${Math.random() * 0.5 + 0.5})`,
                            fill: false,
                            tension: 0.1
                        }))
                    },
                    options: chartConfig.trend.options
                });

                blueBallChart = new Chart(blueCtx, {
                    type: chartConfig.trend.type,
                    data: {
                        labels: trendData.periods,
                        datasets: trendData.blueBalls.map(ball => ({
                            label: ball.label,
                            data: ball.data,
                            borderColor: `rgba(13, 110, 253, ${Math.random() * 0.5 + 0.5})`,
                            fill: false,
                            tension: 0.1
                        }))
                    },
                    options: chartConfig.blueTrend.options
                });
                break;
        }
    },

    // 更新统计表格
    updateStats: (data, historyData) => {
        const redStats = document.getElementById('red-stats');
        const blueStats = document.getElementById('blue-stats');

        // 清空现有内容
        redStats.innerHTML = '';
        blueStats.innerHTML = '';

        // 计算遗漏值
        const redBalls = Array.from({length: 33}, (_, i) => (i + 1).toString().padStart(2, '0'));
        const blueBalls = Array.from({length: 16}, (_, i) => (i + 1).toString().padStart(2, '0'));
        
        const redMissing = utils.calculateMissing(redBalls, historyData.map(item => item.红球));
        const blueMissing = utils.calculateMissing(blueBalls, historyData.map(item => item.蓝球));

        // 计算最近出现期数
        const getLastAppearance = (number, isRed = true) => {
            for (let i = 0; i < historyData.length; i++) {
                if (isRed) {
                    if (historyData[i].红球.includes(number)) {
                        return historyData[i].期号;
                    }
                } else {
                    if (historyData[i].蓝球 === number) {
                        return historyData[i].期号;
                    }
                }
            }
            return '--';
        };

        // 更新红球统计
        Object.entries(data.redBallFrequency)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .forEach(([number, frequency]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${number}</td>
                    <td>${frequency}</td>
                    <td>${getLastAppearance(number)}</td>
                    <td>${redMissing[number] || 0}</td>
                `;
                redStats.appendChild(row);
            });

        // 更新蓝球统计
        Object.entries(data.blueBallFrequency)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .forEach(([number, frequency]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${number}</td>
                    <td>${frequency}</td>
                    <td>${getLastAppearance(number, false)}</td>
                    <td>${blueMissing[number] || 0}</td>
                `;
                blueStats.appendChild(row);
            });
    },

    // 更新数字特征
    updateFeatures: (data) => {
        // 获取所有红球号码
        const redNumbers = Object.keys(data.redBallFrequency).map(num => parseInt(num));
        const blueNumbers = Object.keys(data.blueBallFrequency).map(num => parseInt(num));

        // 更新红球特征
        document.getElementById('red-odd-even-ratio').textContent = utils.calculateOddEvenRatio(redNumbers);
        document.getElementById('red-size-ratio').textContent = utils.calculateSizeRatio(redNumbers, 16);
        document.getElementById('red-sum-range').textContent = `${Math.min(...redNumbers)}-${Math.max(...redNumbers)}`;

        // 更新蓝球特征
        document.getElementById('blue-odd-even-ratio').textContent = utils.calculateOddEvenRatio(blueNumbers);
        document.getElementById('blue-size-ratio').textContent = utils.calculateSizeRatio(blueNumbers, 8);
        
        // 获取热门蓝球（出现频率最高的3个）
        const hotBlue = Object.entries(data.blueBallFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([num]) => num)
            .join(', ');
        document.getElementById('blue-hot-numbers').textContent = hotBlue;
    },

    // 更新图表和统计信息
    updateAll: (historyData, dimension) => {
        // 根据历史数据计算频率
        const frequencyData = dataHandler.calculateFrequencyFromHistory(historyData);
        
        // 根据维度更新图表
        if (dimension === 'trend') {
            // 走势分析使用历史数据
            dataHandler.updateCharts(historyData, dimension);
        } else if (dimension === 'oddEven') {
            // 奇偶分析使用频率数据
            dataHandler.updateCharts(frequencyData, dimension);
        } else {
            // 频率分析使用频率数据
            dataHandler.updateCharts(frequencyData, 'frequency');
        }
        
        // 更新统计信息
        dataHandler.updateStats(frequencyData, historyData);
        dataHandler.updateFeatures(frequencyData);
    }
};

// API调用函数
const api = {
    // 获取频率数据
    getFrequencyData: async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}${config.endpoints.frequency}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取频率数据失败:', error);
            return null;
        }
    },

    // 获取历史数据
    getHistoryData: async (count) => {
        try {
            // 计算日期范围
            const endDate = new Date();
            const startDate = new Date();
            
            // 根据期数计算开始日期（假设平均3天一期）
            const daysToSubtract = count * 3;
            startDate.setDate(startDate.getDate() - daysToSubtract);
            
            // 构建API请求URL
            const url = `${config.apiBaseUrl}${config.endpoints.history}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            console.log('请求历史数据URL:', url);  // 调试日志
            
            const response = await fetch(url);
            const data = await response.json();
            
            // 只返回指定数量的最新数据
            return data.slice(0, count);
        } catch (error) {
            console.error('获取历史数据失败:', error);
            return null;
        }
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 获取初始维度和时间范围
    const initialDimension = document.getElementById('analysis-dimension').value;
    const initialTimeRange = document.getElementById('time-range').value;
    
    // 初始加载数据
    const historyData = await api.getHistoryData(parseInt(initialTimeRange));
    
    if (historyData) {
        console.log('初始历史数据数量:', historyData.length);  // 调试日志
        dataHandler.updateAll(historyData, initialDimension);
    }

    // 监听筛选表单提交
    document.getElementById('filter-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const timeRange = parseInt(document.getElementById('time-range').value);
        const dimension = document.getElementById('analysis-dimension').value;
        
        console.log('选择的时间范围:', timeRange);  // 调试日志
        
        // 根据时间范围获取数据
        const historyData = await api.getHistoryData(timeRange);
        if (!historyData) {
            console.error('获取历史数据失败');  // 调试日志
            return;
        }
        
        console.log('获取到的历史数据数量:', historyData.length);  // 调试日志
        dataHandler.updateAll(historyData, dimension);
    });

    // 监听分析维度变化
    document.getElementById('analysis-dimension').addEventListener('change', async (event) => {
        const dimension = event.target.value;
        const timeRange = parseInt(document.getElementById('time-range').value);
        
        // 根据时间范围获取数据
        const historyData = await api.getHistoryData(timeRange);
        if (!historyData) return;
        
        dataHandler.updateAll(historyData, dimension);
    });
});
