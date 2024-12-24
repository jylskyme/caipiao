const axios = require('axios');
const config = require('../../config/default');
const DrawResult = require('../models/DrawResult');
const CrawlerService = require('./CrawlerService');

class LotteryService {
    // 更新最新开奖数据
    static async updateLatestData() {
        try {
            // 获取最新开奖数据
            const latestData = await CrawlerService.fetchLatestDraw();
            if (!latestData) {
                throw new Error('获取最新开奖数据失败');
            }

            // 检查是否已存在
            const existingDraw = await DrawResult.findOne({
                drawNumber: latestData.drawNumber
            });

            if (existingDraw) {
                console.log('该期开奖数据已存在');
                return existingDraw;
            }

            // 保存新数据
            const newDraw = new DrawResult(latestData);
            await newDraw.save();

            console.log('开奖数据更新成功');
            return newDraw;
        } catch (error) {
            console.error('更新开奖数据失败:', error);
            throw error;
        }
    }

    // 获取指定期数的历史数据
    static async getHistoryData(limit = 50) {
        try {
            const historyData = await DrawResult.find()
                .sort({ drawDate: -1 })
                .limit(limit);

            if (historyData.length < limit) {
                // 如果数据不足，尝试抓取更多
                await CrawlerService.fetchHistoryData(limit);
                return await DrawResult.find()
                    .sort({ drawDate: -1 })
                    .limit(limit);
            }

            return historyData;
        } catch (error) {
            console.error('获取历史数据失败:', error);
            throw error;
        }
    }

    // 获取奖池信息
    static async getPrizePoolInfo() {
        try {
            const latestDraw = await DrawResult.findOne()
                .sort({ drawDate: -1 });

            if (!latestDraw) {
                throw new Error('未找到开奖数据');
            }

            return {
                prizePool: latestDraw.prizePool,
                totalSales: latestDraw.totalSales,
                prizes: latestDraw.prizes
            };
        } catch (error) {
            console.error('获取奖池信息失败:', error);
            throw error;
        }
    }

    // 定时更新任务
    static async scheduleUpdate() {
        try {
            console.log('开始定时更新开奖数据...');
            await this.updateLatestData();
            console.log('定时更新完成');
        } catch (error) {
            console.error('定时更新失败:', error);
        }
    }
}

module.exports = LotteryService; 