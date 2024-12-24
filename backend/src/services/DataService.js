const xlsx = require('xlsx');
const path = require('path');
const DrawResult = require('../models/DrawResult');
const logger = require('../utils/logger');

class DataService {
    // 从Excel文件导入数据
    static async importFromExcel() {
        try {
            // 读取Excel文件
            const filePath = path.join(process.cwd(), 'caipiaodata.xlsx');
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // 转换为JSON数据
            const data = xlsx.utils.sheet_to_json(worksheet);
            
            // 处理每条数据
            const results = [];
            for (const row of data) {
                const drawData = this.parseExcelRow(row);
                if (drawData) {
                    results.push(drawData);
                }
            }

            // 批量保存到数据库
            await this.saveToDatabase(results);
            
            logger.info(`成功导入 ${results.length} 条开奖数据`);
            return results;
        } catch (error) {
            logger.error('导入Excel数据失败:', error);
            throw error;
        }
    }

    // 解析Excel行数据
    static parseExcelRow(row) {
        try {
            // 根据实际Excel格式调整字段名
            return {
                drawNumber: row['期号'].toString(),
                drawDate: new Date(row['开奖日期']),
                numbers: {
                    red: [
                        parseInt(row['红球1']),
                        parseInt(row['红球2']),
                        parseInt(row['红球3']),
                        parseInt(row['红球4']),
                        parseInt(row['红球5']),
                        parseInt(row['红球6'])
                    ],
                    blue: parseInt(row['蓝球'])
                },
                prizePool: parseFloat(row['奖池金额']),
                prizes: {
                    first: {
                        count: parseInt(row['一等奖注数']),
                        amount: parseFloat(row['一等奖金额'])
                    },
                    second: {
                        count: parseInt(row['二等奖注数']),
                        amount: parseFloat(row['二等奖金额'])
                    }
                },
                totalSales: parseFloat(row['总销售额'])
            };
        } catch (error) {
            logger.error('解析Excel行数据失败:', error);
            return null;
        }
    }

    // 保存到数据库
    static async saveToDatabase(data) {
        try {
            // 使用批量操作
            const operations = data.map(item => ({
                updateOne: {
                    filter: { drawNumber: item.drawNumber },
                    update: { $set: item },
                    upsert: true
                }
            }));

            const result = await DrawResult.bulkWrite(operations);
            logger.info('数据库更新结果:', result);
        } catch (error) {
            logger.error('保存数据到数据库失败:', error);
            throw error;
        }
    }

    // 获取最新开奖数据
    static async getLatestDraw() {
        try {
            return await DrawResult.findOne().sort({ drawDate: -1 });
        } catch (error) {
            logger.error('获取最新开奖数据失败:', error);
            throw error;
        }
    }

    // 获取历史数据
    static async getHistoryData(limit = 50) {
        try {
            return await DrawResult.find()
                .sort({ drawDate: -1 })
                .limit(limit);
        } catch (error) {
            logger.error('获���历史数据失败:', error);
            throw error;
        }
    }
}

module.exports = DataService; 