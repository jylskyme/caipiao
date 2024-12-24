// 数据更新模块
const dataUpdater = {
    // 配置信息
    config: {
        // 使用本地API地址
        apiUrl: 'http://localhost:3000/api/lottery/history',
        // 更新间隔（毫秒）
        updateInterval: 5 * 60 * 1000, // 5分钟
        // 最大重试次数
        maxRetries: 3
    },

    // 获取历史数据
    async fetchHistoryData(limit = 50) {
        try {
            // 由于跨域限制，这里需要使用代理服务器或后端API
            const response = await fetch(`/api/lottery/history?limit=${limit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return this.formatHistoryData(data);
        } catch (error) {
            console.error('Error fetching history data:', error);
            return null;
        }
    },

    // 格式化从500彩票网获取的数据
    formatHistoryData(rawData) {
        return rawData.map(item => ({
            period: item.period,                    // 期号
            date: item.date,                       // 开奖日期
            redBalls: item.redBalls.map(Number),   // 红球号码
            blueBall: Number(item.blueBall),       // 蓝球号码
            poolAmount: Number(item.poolAmount),    // 奖池金额
            prizes: {
                first: {
                    count: Number(item.firstPrizeCount),   // 一等奖注数
                    amount: Number(item.firstPrizeAmount)  // 一等奖金额
                },
                second: {
                    count: Number(item.secondPrizeCount),  // 二等奖注数
                    amount: Number(item.secondPrizeAmount) // 二等奖金额
                }
            }
        }));
    },

    // 更新本地数据
    async updateLocalData(newDraw) {
        // 检查是否已存在该期数据
        const existingIndex = historyData.drawHistory.findIndex(
            draw => draw.period === newDraw.period
        );

        if (existingIndex === -1) {
            // 添加新数据到历史记录开头
            historyData.drawHistory.unshift(newDraw);
            
            // 更新统计信息
            dataProcessor.updateStatistics();
            
            // 触发页面更新
            this.triggerPageUpdate();
            
            return true;
        }
        return false;
    },

    // 触发页面更新
    triggerPageUpdate() {
        // 更新首页显示
        if (typeof updateLatestDraw === 'function') updateLatestDraw();
        if (typeof updateHistoryTable === 'function') updateHistoryTable();
        if (typeof updatePrizePool === 'function') updatePrizePool();
        if (typeof updatePrizeInfo === 'function') updatePrizeInfo();
        if (typeof updateNumberAnalysis === 'function') updateNumberAnalysis();
        if (typeof createRangeChart === 'function') createRangeChart();
        if (typeof createOddEvenChart === 'function') createOddEvenChart();
    },

    // 启动自动更新
    startAutoUpdate() {
        // 立即行一次更新
        this.checkForUpdates();
        
        // 设置定时更新
        setInterval(() => this.checkForUpdates(), this.config.updateInterval);
    },

    // 检查更新
    async checkForUpdates() {
        let retries = 0;
        while (retries < this.config.maxRetries) {
            try {
                const latestDraw = await this.fetchLatestDraw();
                if (latestDraw) {
                    const updated = await this.updateLocalData(latestDraw);
                    if (updated) {
                        console.log('Data updated successfully');
                    }
                    break;
                }
            } catch (error) {
                console.error('Update failed:', error);
                retries++;
                await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
        }
    }
}; 