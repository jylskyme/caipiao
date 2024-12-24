// 生成模拟的历史数据
const historyData = {
    // 最近半年开奖记录（模拟数据）
    drawHistory: [
        {
            period: "2024025",
            date: "2024-03-05",
            redBalls: [5, 12, 15, 18, 25, 30],
            blueBall: 5,
            poolAmount: 850000000,
            prizes: {
                first: { count: 15, amount: 8240000 },
                second: { count: 85, amount: 250000 },
                third: { count: 1258, amount: 3000 }
            }
        },
        {
            period: "2024024",
            date: "2024-03-03",
            redBalls: [2, 7, 13, 19, 27, 32],
            blueBall: 12,
            poolAmount: 820000000,
            prizes: {
                first: { count: 8, amount: 7850000 },
                second: { count: 95, amount: 220000 },
                third: { count: 1456, amount: 3000 }
            }
        },
        {
            period: "2024023",
            date: "2024-03-01",
            redBalls: [1, 8, 16, 22, 28, 33],
            blueBall: 6,
            poolAmount: 800000000,
            prizes: {
                first: { count: 10, amount: 7500000 },
                second: { count: 90, amount: 230000 },
                third: { count: 1350, amount: 3000 }
            }
        },
        // ... 可以继续添加更多历史数据
    ]
};

// 添加数据生成函数
function generateHistoricalData(count = 78) { // 半年约78期
    const data = [];
    const startDate = new Date('2024-03-05');
    
    for (let i = 0; i < count; i++) {
        // 生成日期
        const drawDate = new Date(startDate);
        drawDate.setDate(startDate.getDate() - (i * 2)); // 每两天一期
        
        // 生成红球（6个不重复的1-33之间的数字）
        const redBalls = [];
        while (redBalls.length < 6) {
            const num = Math.floor(Math.random() * 33) + 1;
            if (!redBalls.includes(num)) {
                redBalls.push(num);
            }
        }
        redBalls.sort((a, b) => a - b); // 按升序排序
        
        // 生成蓝球（1-16之间的数字）
        const blueBall = Math.floor(Math.random() * 16) + 1;
        
        // 生成奖池金额（7-9亿之间）
        const poolAmount = Math.floor(Math.random() * 200000000) + 700000000;
        
        // 生成中奖情况
        const firstPrizeCount = Math.floor(Math.random() * 15) + 1;
        const firstPrizeAmount = Math.floor(poolAmount / firstPrizeCount / 2);
        
        data.push({
            period: `2024${String(25 - i).padStart(3, '0')}`,
            date: drawDate.toISOString().split('T')[0],
            redBalls: redBalls,
            blueBall: blueBall,
            poolAmount: poolAmount,
            prizes: {
                first: {
                    count: firstPrizeCount,
                    amount: firstPrizeAmount
                },
                second: {
                    count: Math.floor(Math.random() * 100) + 50,
                    amount: Math.floor(Math.random() * 100000) + 200000
                },
                third: {
                    count: Math.floor(Math.random() * 1000) + 1000,
                    amount: 3000
                }
            }
        });
    }
    
    return data;
}

// 生成半年的历史数据
historyData.drawHistory = generateHistoricalData();

// 生成统计数据
function generateStatistics() {
    const stats = {
        redBalls: {
            frequency: {},    // 红球出现频率
            consecutive: [],  // 连号情况
            oddEven: {       // 奇偶比例
                odd: 0,
                even: 0
            }
        },
        blueBalls: {
            frequency: {},    // 蓝球出现频率
            oddEven: {       // 奇偶比例
                odd: 0,
                even: 0
            }
        }
    };
    
    // 初始化频率统计
    for (let i = 1; i <= 33; i++) {
        stats.redBalls.frequency[i] = 0;
    }
    for (let i = 1; i <= 16; i++) {
        stats.blueBalls.frequency[i] = 0;
    }
    
    // 统计每个号码出现的次数
    historyData.drawHistory.forEach(draw => {
        // 统计红球
        draw.redBalls.forEach(num => {
            stats.redBalls.frequency[num]++;
            if (num % 2 === 0) {
                stats.redBalls.oddEven.even++;
            } else {
                stats.redBalls.oddEven.odd++;
            }
        });
        
        // 统计蓝球
        stats.blueBalls.frequency[draw.blueBall]++;
        if (draw.blueBall % 2 === 0) {
            stats.blueBalls.oddEven.even++;
        } else {
            stats.blueBalls.oddEven.odd++;
        }
        
        // 检查连号
        for (let i = 0; i < draw.redBalls.length - 1; i++) {
            if (draw.redBalls[i + 1] - draw.redBalls[i] === 1) {
                stats.redBalls.consecutive.push([draw.redBalls[i], draw.redBalls[i + 1]]);
            }
        }
    });
    
    return stats;
}

// 生成统计数据
historyData.statistics = generateStatistics();

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { historyData };
}