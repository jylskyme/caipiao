const DataService = require('../src/services/DataService');
const mongoose = require('mongoose');
const config = require('../config/default');

async function importData() {
    try {
        // 连接数据库
        await mongoose.connect(config.database.url, config.database.options);
        console.log('数据库连接成功');

        // 导入数据
        console.log('开始导入Excel数据...');
        const results = await DataService.importFromExcel();
        console.log(`成功导入 ${results.length} 条数据`);

        // 断开数据库连接
        await mongoose.disconnect();
        console.log('数据库连接已关闭');
    } catch (error) {
        console.error('数据导入失败:', error);
        process.exit(1);
    }
}

// 执行导入
importData(); 