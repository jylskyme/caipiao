const mongoose = require('mongoose');

// 数据库连接配置
const dbConfig = {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/lottery',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
    }
};

// 连接事件处理
mongoose.connection.on('connected', () => {
    console.log('MongoDB连接成功');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB连接错误:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB连接断开');
});

// 导出配置
module.exports = dbConfig;
