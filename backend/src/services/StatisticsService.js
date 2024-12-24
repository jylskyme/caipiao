const Statistics = require('../models/Statistics');
const DrawResult = require('../models/DrawResult');

class StatisticsService {
    // 更新所有统计数据
    static async updateAllStats() {
        try {
            const historyData = await DrawResult.getHistory(100);
            
            await Promise.all([
                this.updateFrequencyStats(historyData),
                this.updateDistributionStats(historyData),
                this.updateMissingValueStats(historyData)
            ]);

            console.log('统计数据更新完成');
        } catch (error) {
            console.error('更新统计数据失败:', error);
            throw error;
        }
    }

    // 更新频率统计
    static async updateFrequencyStats(historyData) {
        try {
            const frequency = await this.calculateFrequency(historyData);
            
            await Statistics.findOneAndUpdate(
                { type: 'frequency' },
                {
                    data: { frequency },
                    lastUpdated: new Date()
                },
                { upsert: true }
            );
        } catch (error) {
            console.error('更新频率统计失败:', error);
            throw error;
        }
    }

    // 更新分布统计
    static async updateDistributionStats(historyData) {
        try {
            const distribution = await this.calculateDistribution(historyData);
            
            await Statistics.findOneAndUpdate(
                { type: 'distribution' },
                {
                    data: { distribution },
                    lastUpdated: new Date()
                },
                { upsert: true }
            );
        } catch (error) {
            console.error('更新分布统计失败:', error);
            throw error;
        }
    }

    // 更新遗漏值统计
    static async updateMissingValueStats(historyData) {
        try {
            const missing = await this.calculateMissingValues(historyData);
            
            await Statistics.findOneAndUpdate(
                { type: 'missing' },
                {
                    data: { missing },
                    lastUpdated: new Date()
                },
                { upsert: true }
            );
        } catch (error) {
            console.error('更新遗漏值统计失败:', error);
            throw error;
        }
    }

    // 计算号码频率
    static async calculateFrequency(historyData) {
        const frequency = {
            red: new Map(),
            blue: new Map()
        };

        historyData.forEach(draw => {
            draw.numbers.red.forEach(num => {
                frequency.red.set(num, (frequency.red.get(num) || 0) + 1);
            });
            frequency.blue.set(draw.numbers.blue, 
                (frequency.blue.get(draw.numbers.blue) || 0) + 1);
        });

        return frequency;
    }

    // 计算区间分布
    static async calculateDistribution(historyData) {
        const ranges = ['1-5', '6-10', '11-15', '16-20', '21-25', '26-30', '31-33'];
        const counts = new Array(ranges.length).fill(0);

        historyData.forEach(draw => {
            draw.numbers.red.forEach(num => {
                const rangeIndex = Math.floor((num - 1) / 5);
                counts[rangeIndex]++;
            });
        });

        return { ranges, counts };
    }

    // 计算遗漏值
    static async calculateMissingValues(historyData) {
        const missing = [];
        const currentMissing = new Map();
        const maxMissing = new Map();
        const totalMissing = new Map();

        // 初始化
        for (let i = 1; i <= 33; i++) {
            currentMissing.set(i, 0);
            maxMissing.set(i, 0);
            totalMissing.set(i, 0);
        }

        // 计算遗漏值
        historyData.forEach((draw, index) => {
            for (let i = 1; i <= 33; i++) {
                if (!draw.numbers.red.includes(i)) {
                    currentMissing.set(i, currentMissing.get(i) + 1);
                    maxMissing.set(i, Math.max(maxMissing.get(i), currentMissing.get(i)));
                    totalMissing.set(i, totalMissing.get(i) + currentMissing.get(i));
                } else {
                    currentMissing.set(i, 0);
                }
            }
        });

        // 生成统计结果
        for (let i = 1; i <= 33; i++) {
            missing.push({
                number: i,
                currentMissing: currentMissing.get(i),
                maxMissing: maxMissing.get(i),
                avgMissing: totalMissing.get(i) / historyData.length
            });
        }

        return missing;
    }
}

module.exports = StatisticsService; 