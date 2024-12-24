const mongoose = require('mongoose');
const config = require('../config/default');
const DrawResult = require('../src/models/DrawResult');

async function verifyData() {
    try {
        // 连接数据库
        await mongoose.connect(config.database.url, config.database.options);
        console.log('数据库连接成功');

        // 获取数据总数
        const count = await DrawResult.countDocuments();
        console.log(`数据库中共有 ${count} 条记录`);

        // 获取最新一条数据
        const latest = await DrawResult.findOne().sort({ drawDate: -1 });
        if (latest) {
            console.log('最新一期数据:', {
                期号: latest.drawNumber,
                开奖日期: latest.drawDate,
                红球: latest.numbers.red,
                蓝球: latest.numbers.blue
            });
        }

        // 断开数据库连接
        await mongoose.disconnect();
        console.log('数据库连接已关闭');
    } catch (error) {
        console.error('验证失败:', error);
        process.exit(1);
    }
}

// 执行验证
verifyData(); 