// 工具函数
const utils = {
    // 格式化金额
    formatMoney: (amount) => {
        return parseFloat(amount.replace(/,/g, '')).toLocaleString('zh-CN');
    },

    // 创建球号元素
    createBall: (number, type) => {
        const ball = document.createElement('span');
        ball.className = `ball ${type}`;
        ball.textContent = number.padStart(2, '0');
        return ball;
    },

    // 格式化日期
    formatDate: (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', config.dateFormat);
    }
};

// 数据处理函数
const dataHandler = {
    // 更新最新开奖结果
    updateLatestResult: (data) => {
        const result = data[0];  // 获取最新一期数据
        
        // 更新期号和开奖日期
        document.getElementById('period').textContent = result.期号;
        document.getElementById('draw-date').textContent = utils.formatDate(result.开奖日期);

        // 更新红球
        const redBallsContainer = document.querySelector('.red-balls');
        redBallsContainer.innerHTML = '';
        result.红球.forEach(number => {
            redBallsContainer.appendChild(utils.createBall(number, 'red'));
        });

        // 更新蓝球
        const blueBallContainer = document.querySelector('.blue-ball');
        blueBallContainer.innerHTML = '';
        blueBallContainer.appendChild(utils.createBall(result.蓝球, 'blue'));

        // 更新奖金信息
        document.getElementById('pool-prize').textContent = utils.formatMoney(result.奖池奖金);
        document.getElementById('first-prize-count').textContent = result.一等奖.注数;
        document.getElementById('first-prize-amount').textContent = utils.formatMoney(result.一等奖.奖金);
        document.getElementById('second-prize-count').textContent = result.二等奖.注数;
        document.getElementById('second-prize-amount').textContent = utils.formatMoney(result.二等奖.奖金);
    },

    // 更新号码统计
    updateNumberStats: (data) => {
        const { redBallFrequency, blueBallFrequency } = data;

        // 处理红球频率
        const sortedRedBalls = Object.entries(redBallFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        const hotRedBallsContainer = document.getElementById('hot-red-balls');
        hotRedBallsContainer.innerHTML = '';
        sortedRedBalls.forEach(([number, frequency]) => {
            const ball = utils.createBall(number, 'red');
            ball.title = `出现${frequency}次`;
            hotRedBallsContainer.appendChild(ball);
        });

        // 处理蓝球频率
        const sortedBlueBalls = Object.entries(blueBallFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        const hotBlueBallsContainer = document.getElementById('hot-blue-balls');
        hotBlueBallsContainer.innerHTML = '';
        sortedBlueBalls.forEach(([number, frequency]) => {
            const ball = utils.createBall(number, 'blue');
            ball.title = `出现${frequency}次`;
            hotBlueBallsContainer.appendChild(ball);
        });
    },

    // 更新历史记录
    updateHistoryList: (data) => {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            
            // 创建并填充单元格
            const cells = [
                item.期号,
                utils.formatDate(item.开奖日期),
                `${item.红球.map(n => n.padStart(2, '0')).join(' ')} + ${item.蓝球.padStart(2, '0')}`,
                `${item.一等奖.注数}注 ${utils.formatMoney(item.一等奖.奖金)}元`,
                `${item.二等奖.注数}注 ${utils.formatMoney(item.二等奖.奖金)}元`,
                utils.formatMoney(item.奖池奖金)
            ];

            cells.forEach(content => {
                const td = document.createElement('td');
                td.textContent = content;
                row.appendChild(td);
            });

            historyList.appendChild(row);
        });
    }
};

// API调用函数
const api = {
    // 获取最新开奖结果
    getLatestResult: async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}${config.endpoints.latest}?count=1`);
            const data = await response.json();
            dataHandler.updateLatestResult(data);
        } catch (error) {
            console.error('获取最新开奖结果失败:', error);
        }
    },

    // 获取历史数据
    getHistoryData: async () => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);  // 获取最近30天的数据

            const response = await fetch(
                `${config.apiBaseUrl}${config.endpoints.history}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
            );
            const data = await response.json();
            dataHandler.updateHistoryList(data);
        } catch (error) {
            console.error('获取历史数据失败:', error);
        }
    },

    // 获取号码频率统计
    getNumberFrequency: async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}${config.endpoints.frequency}`);
            const data = await response.json();
            dataHandler.updateNumberStats(data);
        } catch (error) {
            console.error('获取号码频率统计失败:', error);
        }
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载所有数据
    api.getLatestResult();
    api.getHistoryData();
    api.getNumberFrequency();

    // 设置定时刷新
    setInterval(() => {
        api.getLatestResult();
        api.getHistoryData();
        api.getNumberFrequency();
    }, config.refreshInterval);
});
