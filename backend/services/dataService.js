const xlsx = require('xlsx');
const path = require('path');

class DataService {
    constructor() {
        this.dataPath = path.join(__dirname, '../data/caipiaodata.xlsx');
        this.data = null;
    }

    // 读取Excel数据
    loadData() {
        try {
            console.log('开始读取Excel文件:', this.dataPath);
            const workbook = xlsx.readFile(this.dataPath);
            console.log('Excel文件读取成功');
            
            const sheetName = workbook.SheetNames[0];
            console.log('工作表名称:', sheetName);
            
            const worksheet = workbook.Sheets[sheetName];
            console.log('工作表范围:', worksheet['!ref']);
            
            // 先读取原始数据看看结构
            const rawData = xlsx.utils.sheet_to_json(worksheet);
            console.log('原始数据第一行:', JSON.stringify(rawData[0], null, 2));
            
            // 获取所有列名
            const headers = Object.keys(rawData[0]);
            console.log('检测到的列名:', headers);
            
            // 将Excel数据转换为JSON，使用检测到的列名
            this.data = rawData.slice(1).map(row => {
                const redBalls = [];
                headers.forEach(header => {
                    if (header.includes('红球号码')) {
                        redBalls.push(row[header]);
                    }
                });
                
                return {
                    期号: row['期号 '] || '',
                    红球: redBalls,
                    蓝球: row['蓝球'] || '',
                    开奖日期: row['开奖日期'] || '',
                    奖池奖金: row['奖池奖金(元)'] || '',
                    一等奖: {
                        注数: row['一等奖'] || '',
                        奖金: row['一等奖_1'] || ''
                    },
                    二等奖: {
                        注数: row['二等奖'] || '',
                        奖金: row['二等奖_1'] || ''
                    },
                    总投注额: row['总投注额(元)'] || ''
                };
            });

            console.log('处理后的第一条数据:', JSON.stringify(this.data[0], null, 2));
            return this.data;
        } catch (error) {
            console.error('读取Excel数据失败:', error);
            throw error;
        }
    }

    // 获取最新的开奖记录
    getLatestDrawing(count = 1) {
        if (!this.data) {
            this.loadData();
        }
        return this.data.slice(0, count);
    }

    // 获取历史数据
    getHistoryData(startDate, endDate) {
        if (!this.data) {
            this.loadData();
        }
        return this.data.filter(record => {
            const recordDate = new Date(record.开奖日期);
            return recordDate >= startDate && recordDate <= endDate;
        });
    }

    // 统计号码出现频率
    analyzeNumberFrequency() {
        if (!this.data) {
            this.loadData();
        }
        
        const redBallFreq = {};
        const blueBallFreq = {};

        this.data.forEach(record => {
            // 统计红球
            record.红球.forEach(num => {
                if (num) {
                    redBallFreq[num] = (redBallFreq[num] || 0) + 1;
                }
            });
            
            // 统计蓝球
            if (record.蓝球) {
                blueBallFreq[record.蓝球] = (blueBallFreq[record.蓝球] || 0) + 1;
            }
        });

        return {
            redBallFrequency: redBallFreq,
            blueBallFrequency: blueBallFreq
        };
    }
}

module.exports = new DataService(); 