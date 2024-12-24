const express = require('express');
const router = express.Router();
const LotteryController = require('../controllers/LotteryController');
const { rateLimiter } = require('../middleware/rateLimiter');

// 获取最新开奖信息
router.get('/latest', rateLimiter, LotteryController.getLatest);

// 获取历史开奖记录
router.get('/history', rateLimiter, LotteryController.getHistory);

// 手动触发数据更新
router.post('/update', rateLimiter, LotteryController.updateData);

module.exports = router; 