const express = require('express');
const cors = require('cors');
const path = require('path');
const dataService = require('./services/dataService');

const app = express();
const port = 54321;
const host = '127.0.0.1';  // 明确使用IPv4地址

// 启用所有CORS请求
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 配置静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));

// 页面路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/analysis.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/analysis.html'));
});

app.get('/predict.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/predict.html'));
});

// 添加基本的健康检查端点
app.get('/api/health', (req, res) => {
    console.log('收到健康检查请求');
    res.json({ status: 'ok', message: '服务器正在运行' });
});

// 在服务器启动时预加载数据
console.log('正在加载数据...');
try {
    dataService.loadData();
    console.log('数据加载成功');
} catch (error) {
    console.error('数据加载失败:', error);
    process.exit(1);
}

// 获取最新开奖数据
app.get('/api/latest', async (req, res) => {
    console.log('收到获取最新数据请求:', req.query);
    try {
        const count = parseInt(req.query.count) || 1;
        const data = dataService.getLatestDrawing(count);
        console.log('返回最新数据:', data);
        res.json(data);
    } catch (error) {
        console.error('获取最新数据失败:', error);
        res.status(500).json({ error: error.message });
    }
});

// 获取历史数据
app.get('/api/history', async (req, res) => {
    console.log('收到获取历史数据请求:', req.query);
    try {
        const { startDate, endDate } = req.query;
        const data = dataService.getHistoryData(
            new Date(startDate),
            new Date(endDate)
        );
        console.log('返回历史数据数量:', data.length);
        res.json(data);
    } catch (error) {
        console.error('获取历史数据失败:', error);
        res.status(500).json({ error: error.message });
    }
});

// 获取号码频率分析
app.get('/api/analysis/frequency', async (req, res) => {
    console.log('收到频率分析请求');
    try {
        const data = dataService.analyzeNumberFrequency();
        console.log('返回频率分析数据');
        res.json(data);
    } catch (error) {
        console.error('获取频率分析失败:', error);
        res.status(500).json({ error: error.message });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
    console.error('未捕获的异��:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});

// 启动服务器
const server = app.listen(port, host, (error) => {
    if (error) {
        console.error('启动服务器时出错:', error);
        process.exit(1);
    }
    console.log('=================================');
    console.log(`服务器运行在 http://${host}:${port}`);
    console.log('可用的API端点:');
    console.log(`- GET http://${host}:${port}/api/health`);
    console.log(`- GET http://${host}:${port}/api/latest?count=1`);
    console.log(`- GET http://${host}:${port}/api/history?startDate=2024-01-01&endDate=2024-12-31`);
    console.log(`- GET http://${host}:${port}/api/analysis/frequency`);
    console.log('=================================');
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，准备关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
}); 