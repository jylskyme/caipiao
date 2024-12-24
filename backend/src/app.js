const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config/default');
const routes = require('./routes');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// 视图文件路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
});

app.get('/analysis.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/analysis.html'));
});

app.get('/predict.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/predict.html'));
});

// API路由
app.use('/api', routes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    });
});

// 数据库连接
mongoose.connect(config.database.url, config.database.options)
    .then(() => {
        console.log('数据库连接成功');
        // 启动服务器
        app.listen(config.server.port, () => {
            console.log(`服务器运行在 http://localhost:${config.server.port}`);
        });
    })
    .catch(err => {
        console.error('数据库连接失败:', err);
        process.exit(1);
    });

module.exports = app;
