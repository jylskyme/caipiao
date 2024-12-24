const StatisticsService = require('../services/StatisticsService');
const Statistics = require('../models/Statistics');

class StatisticsController {
    // 获取号码频率统计
    static async getFrequencyStats(req, res) {
        try {
            const stats = await Statistics.getFrequencyStats();
            if (!stats) {
                return res.status(404).json({
                    success: false,
                    message: '未找到频率统计数据'
                });
            }

            res.json({
                success: true,
                data: stats.data.frequency
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 获取区间分布统计
    static async getDistributionStats(req, res) {
        try {
            const stats = await Statistics.getDistributionStats();
            if (!stats) {
                return res.status(404).json({
                    success: false,
                    message: '未找到分布统计数据'
                });
            }

            res.json({
                success: true,
                data: stats.data.distribution
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 获取遗漏值统计
    static async getMissingValueStats(req, res) {
        try {
            const stats = await Statistics.getMissingStats();
            if (!stats) {
                return res.status(404).json({
                    success: false,
                    message: '未找到遗漏值统计数据'
                });
            }

            res.json({
                success: true,
                data: stats.data.missing
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 更新统计数据
    static async updateStatistics(req, res) {
        try {
            await StatisticsService.updateAllStats();
            res.json({
                success: true,
                message: '统计数据更新成功'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = StatisticsController; 