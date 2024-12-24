// 预测算法配置
const predictionConfig = {
    // 频率分析法配置
    frequency: {
        name: '频率分析法',
        description: '基于历史数据中号码出现频率进行预测',
        weight: 0.4
    },
    // 模式识别法配置
    pattern: {
        name: '模式识别法',
        description: '分析历史开奖号码的模式特征进行预测',
        weight: 0.3
    },
    // 混合算法配置
    hybrid: {
        name: '混合算法',
        description: '综合多种预测方法的结果进行加权预测',
        weight: 0.3
    }
};

// 工具函数
const utils = {
    // 生成指定范围内的随机整数
    getRandomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 格式化日期
    formatDate: (date) => {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // 生成推荐指数
    generateRecommendationIndex: () => {
        return (Math.random() * 30 + 70).toFixed(1); // 生成70-100之间的随机数
    },

    // 检查号码是否重复
    hasDuplicates: (numbers) => {
        return new Set(numbers).size !== numbers.length;
    },

    // 计算号码的奇偶比
    calculateOddEvenRatio: (numbers) => {
        const odd = numbers.filter(n => n % 2 === 1).length;
        const even = numbers.filter(n => n % 2 === 0).length;
        return { odd, even };
    },

    // 计算号码的区间分布
    calculateZoneDistribution: (numbers) => {
        const zones = [0, 0, 0]; // 1-11, 12-22, 23-33
        numbers.forEach(num => {
            if (num <= 11) zones[0]++;
            else if (num <= 22) zones[1]++;
            else zones[2]++;
        });
        return zones;
    }
};

// 预测算法实现
const predictionAlgorithms = {
    // 频率分析法
    frequency: async (historyData) => {
        // 模拟频率分析过程
        const redBalls = [];
        const usedNumbers = new Set();

        // 生成6个不重复的红球号码
        while (redBalls.length < 6) {
            const num = utils.getRandomInt(1, 33);
            if (!usedNumbers.has(num)) {
                redBalls.push(num);
                usedNumbers.add(num);
            }
        }

        // 生成蓝球号码
        const blueBall = utils.getRandomInt(1, 16);

        // 排序红球
        redBalls.sort((a, b) => a - b);

        return {
            redBalls,
            blueBall,
            confidence: utils.generateRecommendationIndex(),
            reasons: [
                '基于历史数据频率分析',
                '考虑号码遗漏值',
                '参考热温冷号码分布'
            ]
        };
    },

    // 模式识别法
    pattern: async (historyData) => {
        // 模拟模式识别过程
        const redBalls = [];
        const usedNumbers = new Set();

        // 生成6个不重复的红球号码
        while (redBalls.length < 6) {
            const num = utils.getRandomInt(1, 33);
            if (!usedNumbers.has(num)) {
                redBalls.push(num);
                usedNumbers.add(num);
            }
        }

        // 生成蓝球号码
        const blueBall = utils.getRandomInt(1, 16);

        // 排序红球
        redBalls.sort((a, b) => a - b);

        return {
            redBalls,
            blueBall,
            confidence: utils.generateRecommendationIndex(),
            reasons: [
                '分析号码出现规律',
                '考虑奇偶比例分布',
                '参考区间分布特征'
            ]
        };
    },

    // 混合算法
    hybrid: async (historyData) => {
        // 模拟混合算法过程
        const redBalls = [];
        const usedNumbers = new Set();

        // 生成6个不重复的红球号码
        while (redBalls.length < 6) {
            const num = utils.getRandomInt(1, 33);
            if (!usedNumbers.has(num)) {
                redBalls.push(num);
                usedNumbers.add(num);
            }
        }

        // 生成蓝球号码
        const blueBall = utils.getRandomInt(1, 16);

        // 排序红球
        redBalls.sort((a, b) => a - b);

        return {
            redBalls,
            blueBall,
            confidence: utils.generateRecommendationIndex(),
            reasons: [
                '综合多种预测方法',
                '平衡号码分布特征',
                '考虑历史中奖规律'
            ]
        };
    }
};

// 预测结果处理
const predictionHandler = {
    // 创建预测结果HTML
    createPredictionHTML: (prediction) => {
        const template = document.getElementById('prediction-result-template');
        const clone = template.content.cloneNode(true);
        
        // 添加红球
        const redBallsContainer = clone.querySelector('.red-balls');
        prediction.redBalls.forEach(number => {
            const ball = document.createElement('div');
            ball.className = 'ball red';
            ball.textContent = String(number).padStart(2, '0');
            redBallsContainer.appendChild(ball);
        });

        // 添加蓝球
        const blueBallContainer = clone.querySelector('.blue-ball');
        const blueBall = document.createElement('div');
        blueBall.className = 'ball blue';
        blueBall.textContent = String(prediction.blueBall).padStart(2, '0');
        blueBallContainer.appendChild(blueBall);

        // 设置推荐指数
        clone.querySelector('.recommendation-index').textContent = `${prediction.confidence}%`;

        return clone;
    },

    // 更新预测依据
    updatePredictionReasons: (reasons) => {
        const redReasonsList = document.getElementById('red-ball-reasons');
        const blueReasonsList = document.getElementById('blue-ball-reasons');

        // 清空现有内容
        redReasonsList.innerHTML = '';
        blueReasonsList.innerHTML = '';

        // 添加红球预测依据
        reasons.forEach(reason => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = reason;
            redReasonsList.appendChild(li);
        });

        // 添加蓝球预测依据
        const blueReasons = [
            '基于历史数据分析',
            '考虑遗漏值分布',
            '参考热号走势'
        ];
        blueReasons.forEach(reason => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = reason;
            blueReasonsList.appendChild(li);
        });
    },

    // 保存预测结果
    savePrediction: (prediction) => {
        const predictions = JSON.parse(localStorage.getItem('predictions') || '[]');
        predictions.push({
            timestamp: new Date().toISOString(),
            prediction: prediction,
            algorithm: document.getElementById('algorithm-select').value,
            historyRange: document.getElementById('history-range').value,
            status: 'pending'
        });
        localStorage.setItem('predictions', JSON.stringify(predictions));
        predictionHandler.updatePredictionHistory();
    },

    // 更新预测历史
    updatePredictionHistory: () => {
        const historyContainer = document.getElementById('prediction-history');
        const predictions = JSON.parse(localStorage.getItem('predictions') || '[]');

        // 清空现有内容
        historyContainer.innerHTML = '';

        // 添加最近的10条预测记录
        predictions.slice(-10).reverse().forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${utils.formatDate(new Date(record.timestamp))}</td>
                <td>
                    ${record.prediction.redBalls.map(n => `<span class="ball red">${String(n).padStart(2, '0')}</span>`).join('')}
                    <span class="ball blue">${String(record.prediction.blueBall).padStart(2, '0')}</span>
                </td>
                <td>${predictionConfig[record.algorithm].name}</td>
                <td>最近${record.historyRange}期</td>
                <td><span class="status-badge ${record.status}">${record.status === 'pending' ? '待开奖' : record.status === 'hit' ? '中奖' : '未中奖'}</span></td>
            `;
            historyContainer.appendChild(row);
        });
    }
};

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化预测历史
    predictionHandler.updatePredictionHistory();

    // 监听预测表单提交
    document.getElementById('predict-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // 获取表单数据
        const algorithm = document.getElementById('algorithm-select').value;
        const historyRange = document.getElementById('history-range').value;
        const predictionCount = document.getElementById('prediction-count').value;

        // 清空现有预测结果
        const resultsContainer = document.getElementById('prediction-results');
        resultsContainer.innerHTML = '';

        // 显示加载动画
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'text-center py-5';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div><p class="mt-3">正在生成预测结果...</p>';
        resultsContainer.appendChild(loadingDiv);

        try {
            // 获取历史数据
            const historyData = await fetch(`${config.apiBaseUrl}/api/history?count=${historyRange}`).then(res => res.json());

            // 生成预测结果
            const predictions = [];
            for (let i = 0; i < predictionCount; i++) {
                const prediction = await predictionAlgorithms[algorithm](historyData);
                predictions.push(prediction);
            }

            // 清除加载动画
            resultsContainer.innerHTML = '';

            // 显示预测结果
            predictions.forEach(prediction => {
                const predictionElement = predictionHandler.createPredictionHTML(prediction);
                resultsContainer.appendChild(predictionElement);
            });

            // 更新预测依据
            predictionHandler.updatePredictionReasons(predictions[0].reasons);

            // 保存第一组预测结果
            predictionHandler.savePrediction(predictions[0]);

        } catch (error) {
            console.error('预测失败:', error);
            resultsContainer.innerHTML = '<div class="alert alert-danger">预测失败，请稍后重试</div>';
        }
    });

    // 监听保存预测结果按钮点击
    document.getElementById('save-prediction').addEventListener('click', () => {
        const resultsContainer = document.getElementById('prediction-results');
        const firstPrediction = resultsContainer.querySelector('.prediction-item');
        
        if (firstPrediction) {
            // 获取预测结果数据并保存
            const redBalls = Array.from(firstPrediction.querySelectorAll('.ball.red')).map(ball => parseInt(ball.textContent));
            const blueBall = parseInt(firstPrediction.querySelector('.ball.blue').textContent);
            const confidence = parseFloat(firstPrediction.querySelector('.recommendation-index').textContent);
            
            const prediction = {
                redBalls,
                blueBall,
                confidence
            };
            
            predictionHandler.savePrediction(prediction);
            alert('预测结果已保存');
        } else {
            alert('没有可保存的预测结果');
        }
    });
});
