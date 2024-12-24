const winston = require('winston');
const path = require('path');

// 创建日志目录
const logDir = path.join(__dirname, '../../logs');

// 配置日志格式
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
    ),
    transports: [
        // 错误日志
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),
        // 普通日志
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

// 开发环境下同时输出到控制台
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger; 