const logger = require('../utils/logger');

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    // 记录错误日志
    logger.error('错误:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // 区分不同类型的错误
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: '数据验证失败',
            errors: err.errors
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: '无效的ID格式'
        });
    }

    // 默认错误响应
    res.status(err.status || 500).json({
        success: false,
        message: err.message || '服务器内部错误'
    });
};

module.exports = errorHandler; 