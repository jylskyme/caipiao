const LotteryService = require('../services/LotteryService');
const DrawResult = require('../models/DrawResult');

class LotteryController {
    // 获取最新开奖信息
    static async getLatest(req, res) {
        try {
            const result = await DrawResult.getLatest();
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: '未找到开奖数据'
                });
            }

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 获取历史开奖记录
    static async getHistory(req, res) {
        try {
            const { limit = 50 } = req.query;
            const results = await DrawResult.getHistory(parseInt(limit));

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 手动触发数据更新
    static async updateData(req, res) {
        try {
            await LotteryService.updateLatestData();
            res.json({
                success: true,
                message: '数据更新成功'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = LotteryController; 