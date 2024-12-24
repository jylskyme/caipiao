const DrawResult = require('../models/DrawResult');
const Prediction = require('../models/Prediction');
const StatisticsService = require('./StatisticsService');

class PredictionService {
    // 生成预测号码
    static async generatePrediction() {
        try {
            // 获取历史数据和统计数据
            const historyData = await DrawResult.getHistory(50);
            const frequencyStats = await StatisticsService.calculateFrequency(historyData);
            const missingStats = await StatisticsService.calculateMissingValues(historyData);

            // 生成红球预测
            const redBalls = await this.predictRedBalls(
                historyData,
                frequencyStats,
                missingStats
            );

            // 生成蓝球预测
            const blueBall = await this.predictBlueBall(
                historyData,
                frequencyStats
            );

            // 创建预测记录
            const prediction = new Prediction({
                drawNumber: await this.getNextDrawNumber(),
                predictedNumbers: {
                    red: redBalls,
                    blue: blueBall
                },
                basis: {
                    historicalAnalysis: this.generateHistoricalAnalysis(historyData),
                    patternAnalysis: this.generatePatternAnalysis(frequencyStats),
                    comprehensiveAnalysis: this.generateComprehensiveAnalysis(missingStats)
                }
            });

            await prediction.save();
            return prediction;
        } catch (error) {
            console.error('生成预测失败:', error);
            throw error;
        }
    }

    // 预测红球
    static async predictRedBalls(historyData, frequencyStats, missingStats) {
        // 使用多种策略综合预测
        const strategies = [
            this.frequencyStrategy(frequencyStats.red),
            this.missingValueStrategy(missingStats),
            this.patternStrategy(historyData)
        ];

        // 合并各策略结果
        const candidates = new Map();
        strategies.forEach(strategy => {
            strategy.forEach((weight, number) => {
                candidates.set(number, (candidates.get(number) || 0) + weight);
            });
        });

        // 选择权重最高的6个号码
        return Array.from(candidates.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(entry => entry[0])
            .sort((a, b) => a - b);
    }

    // 预测蓝球
    static async predictBlueBall(historyData, frequencyStats) {
        const blueFrequency = frequencyStats.blue;
        const weights = new Map();

        // 计算每个蓝球的权重
        for (let i = 1; i <= 16; i++) {
            weights.set(i, (blueFrequency.get(i) || 0) / historyData.length);
        }

        // 选择权重最高的号码
        return Array.from(weights.entries())
            .sort((a, b) => b[1] - a[1])[0][0];
    }

    // 获取下一期期号
    static async getNextDrawNumber() {
        const latestDraw = await DrawResult.getLatest();
        if (!latestDraw) {
            throw new Error('无法获取最新开奖信息');
        }
        return (parseInt(latestDraw.drawNumber) + 1).toString();
    }

    // 生成历史分析说明
    static generateHistoricalAnalysis(historyData) {
        return `基于近${historyData.length}期开奖数据分析，` +
               `结合号码出现频率和遗漏值进行预测。`;
    }

    // 生成规律分析说明
    static generatePatternAnalysis(frequencyStats) {
        return `通过号码频率分布规律分析，` +
               `识别热号和冷号的周期性变化特征。`;
    }

    // 生成综合分析说明
    static generateComprehensiveAnalysis(missingStats) {
        return `综合考虑号码遗漏值、出现频率和位置分布，` +
               `预测下期可能开出的号码组合。`;
    }
}

module.exports = PredictionService; 