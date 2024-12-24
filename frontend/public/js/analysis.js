// 图表配置
const chartConfig = {
    // 红球频率图表配置
    redBallChart: {
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
    // 蓝球频率图表配置
    blueBallChart: {
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
    }
};

// 数据处理函数
const dataHandler = {
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
    updateCharts: (frequencyData) => {
        // 更新红球图表
        const redCtx = document.getElementById('red-ball-chart').getContext('2d');
        const redChart = utils.createChart(redCtx, {
            type: chartConfig.redBallChart.type,
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
            options: chartConfig.redBallChart.options
        });

        // 更新蓝球图表
        const blueCtx = document.getElementById('blue-ball-chart').getContext('2d');
        const blueChart = utils.createChart(blueCtx, {
            type: chartConfig.blueBallChart.type,
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
            options: chartConfig.blueBallChart.options
        });
    },

    // 更新统计表格
    updateStats: (data) => {
        const redStats = document.getElementById('red-stats');
        const blueStats = document.getElementById('blue-stats');

        // 清空现有内容
        redStats.innerHTML = '';
        blueStats.innerHTML = '';

        // 更新红球统计
        Object.entries(data.redBallFrequency)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .forEach(([number, frequency]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${number}</td>
                    <td>${frequency}</td>
                    <td>--</td>
                    <td>--</td>
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
                    <td>--</td>
                    <td>--</td>
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
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - count);

            const response = await fetch(
                `${config.apiBaseUrl}${config.endpoints.history}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取历史数据失败:', error);
            return null;
        }
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 获取频率数据并更新图表
    const frequencyData = await api.getFrequencyData();
    if (frequencyData) {
        const processedData = dataHandler.processFrequencyData(frequencyData);
        dataHandler.updateCharts(processedData);
        dataHandler.updateStats(frequencyData);
        dataHandler.updateFeatures(frequencyData);
    }

    // 监听筛选表单提交
    document.getElementById('filter-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const timeRange = document.getElementById('time-range').value;
        const dimension = document.getElementById('analysis-dimension').value;

        // 根据选择的维度更新数据
        const historyData = await api.getHistoryData(parseInt(timeRange));
        if (historyData) {
            // TODO: 根据选择的维度处理和显示数据
        }
    });
});
