const PredictionService = require('../services/PredictionService');
const Prediction = require('../models/Prediction');

class PredictionController {
    // 生成预测号码
    static async generatePrediction(req, res) {
        try {
            const prediction = await PredictionService.generatePrediction();
            res.json({
                success: true,
                data: prediction
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 获取预测历史
    static async getPredictionHistory(req, res) {
        try {
            const { limit = 10 } = req.query;
            const history = await Prediction.getHistory(parseInt(limit));

            res.json({
                success: true,
                data: history
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // 获取预测依据
    static async getPredictionBasis(req, res) {
        try {
            const basis = await PredictionService.getPredictionBasis();
            res.json({
                success: true,
                data: basis
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = PredictionController; 