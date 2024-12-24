const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config/default');

class CrawlerService {
    // 获取最新开奖数据
    static async fetchLatestDraw() {
        try {
            const html = await this.fetchPage(config.crawler.baseUrl);
            const $ = cheerio.load(html);
            
            // 获取最新一期数据
            const latestRow = $('.tdata tr').first();
            return this.parseDrawData(latestRow, $);
        } catch (error) {
            console.error('获取最新开奖数据失败:', error);
            throw error;
        }
    }

    // 获取历史开奖数据
    static async fetchHistoryData(limit = 50) {
        try {
            const html = await this.fetchPage(config.crawler.baseUrl);
            const $ = cheerio.load(html);
            
            const results = [];
            $('.tdata tr').slice(0, limit).each((index, element) => {
                const drawData = this.parseDrawData($(element), $);
                if (drawData) {
                    results.push(drawData);
                }
            });

            return results;
        } catch (error) {
            console.error('获取历史开奖数据失败:', error);
            throw error;
        }
    }

    // 解析开奖数据
    static parseDrawData(row, $) {
        try {
            const cells = row.find('td');
            
            // 期号
            const drawNumber = $(cells[0]).text().trim();
            
            // 开奖日期
            const drawDate = this.parseDate($(cells[1]).text().trim());
            
            // 红球
            const redBalls = [];
            cells.slice(2, 8).each((index, cell) => {
                redBalls.push(parseInt($(cell).text().trim()));
            });
            
            // 蓝球
            const blueBall = parseInt($(cells[8]).text().trim());
            
            // 奖池金额
            const prizePool = this.parseAmount($(cells[9]).text().trim());
            
            // 一等奖信息
            const firstPrize = {
                count: parseInt($(cells[10]).text().trim()),
                amount: this.parseAmount($(cells[11]).text().trim())
            };
            
            // 二等奖信息
            const secondPrize = {
                count: parseInt($(cells[12]).text().trim()),
                amount: this.parseAmount($(cells[13]).text().trim())
            };
            
            // 总销售额
            const totalSales = this.parseAmount($(cells[14]).text().trim());

            return {
                drawNumber,
                drawDate,
                numbers: {
                    red: redBalls,
                    blue: blueBall
                },
                prizePool,
                prizes: {
                    first: firstPrize,
                    second: secondPrize
                },
                totalSales
            };
        } catch (error) {
            console.error('解析开奖数据失败:', error);
            return null;
        }
    }

    // 获取页面内容
    static async fetchPage(url) {
        try {
            const response = await axios.get(url, {
                timeout: config.crawler.timeout,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                }
            });

            if (response.status !== 200) {
                throw new Error(`HTTP错误: ${response.status}`);
            }

            return response.data;
        } catch (error) {
            console.error('获取页面失败:', error);
            throw error;
        }
    }

    // 解析日期
    static parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day);
    }

    // 解析金额（去除逗号和单位）
    static parseAmount(amountStr) {
        return parseInt(amountStr.replace(/[,元]/g, ''));
    }

    // 添加随机延迟
    static async delay(min = 1000, max = 3000) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // 错误重试机制
    static async retryOperation(operation, maxRetries = 3) {
        let lastError;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                console.warn(`操作失败，第${i + 1}次重试...`);
                lastError = error;
                await this.delay(1000 * (i + 1)); // 递增延迟
            }
        }

        throw new Error(`操作失败，已重试${maxRetries}次: ${lastError.message}`);
    }
}

module.exports = CrawlerService; 