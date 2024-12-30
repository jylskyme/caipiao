module.exports = {
    server: {
        port: process.env.PORT || 54321,
        env: process.env.NODE_ENV || 'development'
    },
    
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/lottery',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    
    crawler: {
        baseUrl: 'https://datachart.500.com/ssq/history/history.shtml',
        interval: 5 * 60 * 1000, // 5分钟
        timeout: 10000 // 10秒
    },
    
    api: {
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15分钟
            max: 100 // 限制每个IP 100次请求
        }
    }
};
