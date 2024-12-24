const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/StatisticsController');
const { rateLimiter } = require('../middleware/rateLimiter');

// 获取号码频率统计
router.get('/frequency', rateLimiter, StatisticsController.getFrequencyStats);

// 获取区间分布统计
router.get('/distribution', rateLimiter, StatisticsController.getDistributionStats);

// 获取遗漏值统计
router.get('/missing-values', rateLimiter, StatisticsController.getMissingValueStats);

// 更新统计数据
router.post('/update', rateLimiter, StatisticsController.updateStatistics);

module.exports = router; 