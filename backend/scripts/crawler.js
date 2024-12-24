const cron = require('node-cron');
const LotteryService = require('../src/services/LotteryService');
const StatisticsService = require('../src/services/StatisticsService');

// 配置定时任务
const scheduleJobs = () => {
    // 每5分钟更新一次最新开奖数据
    cron.schedule('*/5 * * * *', async () => {
        try {
            console.log('开始定时更新开奖数据...');
            await LotteryService.updateLatestData();
            console.log('开奖数据更新完成');
        } catch (error) {
            console.error('开奖数据更新失败:', error);
        }
    });

    // 每小时更新一次统计数据
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('开始更新统计数据...');
            await StatisticsService.updateAllStats();
            console.log('统计数据更新完成');
        } catch (error) {
            console.error('统计数据更新失败:', error);
        }
    });
};

// 启动定时任务
console.log('启动数据更新定时任务...');
scheduleJobs();
