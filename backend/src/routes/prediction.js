const express = require('express');
const router = express.Router();
const PredictionController = require('../controllers/PredictionController');
const { rateLimiter } = require('../middleware/rateLimiter');

// 生成预测号码
router.get('/generate', rateLimiter, PredictionController.generatePrediction);

// 获取预测历史
router.get('/history', rateLimiter, PredictionController.getPredictionHistory);

// 获取预测依据
router.get('/basis', rateLimiter, PredictionController.getPredictionBasis);

module.exports = router; 