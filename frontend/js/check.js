// 工具函数
const utils = {
    // 解析输入的号码
    parseNumbers: (input) => {
        const lines = input.trim().split('\n');
        return lines.map(line => {
            const numbers = line.trim().split(/\s+/);
            if (numbers.length !== 7) return null;
            return {
                red: numbers.slice(0, 6),
                blue: numbers[6]
            };
        }).filter(group => group !== null);
    },

    // 格式化日期
    formatDate: (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', config.dateFormat);
    },

    // 检查号码格式是否正确
    validateNumbers: (numbers) => {
        const isValidRedBall = (num) => {
            const n = parseInt(num);
            return !isNaN(n) && n >= 1 && n <= 33 && num.length === 2;
        };

        const isValidBlueBall = (num) => {
            const n = parseInt(num);
            return !isNaN(n) && n >= 1 && n <= 16 && num.length === 2;
        };

        return numbers.every(group => {
            // 检查红球
            if (group.red.length !== 6) return false;
            if (!group.red.every(isValidRedBall)) return false;
            // 检查是否有重复的红球
            if (new Set(group.red).size !== 6) return false;
            // 检查蓝球
            if (!isValidBlueBall(group.blue)) return false;
            return true;
        });
    },

    // 计算中奖等级
    calculatePrize: (userNumbers, winningNumbers) => {
        // 计算红球匹配数
        const redMatches = userNumbers.red.filter(num => 
            winningNumbers.红球.includes(num)
        ).length;

        // 计算蓝球是否匹配
        const blueMatch = userNumbers.blue === winningNumbers.蓝球;

        // 返回匹配信息和中奖等级
        const result = {
            redMatches,
            blueMatch,
            matchedRed: userNumbers.red.filter(num => winningNumbers.红球.includes(num)),
            prize: '未中奖'
        };

        // 判断中奖等级
        if (redMatches === 6 && blueMatch) {
            result.prize = '一等奖';
        } else if (redMatches === 6) {
            result.prize = '二等奖';
        } else if (redMatches === 5 && blueMatch) {
            result.prize = '三等奖';
        } else if (redMatches === 5 || (redMatches === 4 && blueMatch)) {
            result.prize = '四等奖';
        } else if (redMatches === 4 || (redMatches === 3 && blueMatch)) {
            result.prize = '五等奖';
        } else if (blueMatch && redMatches >= 0 && redMatches <= 2) {
            result.prize = '六等奖';
        }

        return result;
    }
};

// API调用函数
const api = {
    // 获取最新开奖号码
    getLatestDraw: async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}${config.endpoints.latest}?count=1`);
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('获取最新开奖号码失败:', error);
            return null;
        }
    }
};

// 页面处理函数
const pageHandler = {
    // 更新最新开奖信息显示
    updateLatestDraw: (data) => {
        document.getElementById('latest-draw-number').textContent = data.期号;
        document.getElementById('latest-draw-date').textContent = utils.formatDate(data.开奖日期);
        
        // 更新红球
        data.红球.forEach((num, index) => {
            document.getElementById(`red-ball-${index + 1}`).textContent = num;
        });
        
        // 更新蓝球
        document.getElementById('blue-ball').textContent = data.蓝球;
    },

    // 更新查询结果表格
    updateResultTable: (numbers, winningNumbers) => {
        const tbody = document.getElementById('result-table');
        tbody.innerHTML = ''; // 清空现有内容

        numbers.forEach((group, index) => {
            const result = utils.calculatePrize(group, winningNumbers);
            const row = document.createElement('tr');
            
            // 根据中奖等级设置样式
            if (result.prize !== '未中奖') {
                row.classList.add('table-success');
            }
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <span class="text-danger">${group.red.join(',')}</span>
                    <span class="text-primary">+${group.blue}</span>
                </td>
                <td>
                    <span class="text-danger">${result.matchedRed.join(',')}</span>
                    (${result.redMatches}个)
                </td>
                <td>${result.blueMatch ? '✓' : '✗'}</td>
                <td>${result.prize}</td>
            `;
            
            tbody.appendChild(row);
        });
    },

    // 处理表单提交
    handleSubmit: async (event) => {
        event.preventDefault();
        
        // 获取输入的号码
        const input = document.getElementById('numbers-input').value.trim();
        if (!input) {
            alert('请输入要查询的号码');
            return;
        }

        try {
            // 解析输入的号码
            const numbers = utils.parseNumbers(input);
            
            // 验证号码格式
            if (!utils.validateNumbers(numbers)) {
                alert('号码格式不正确，请检查后重试');
                return;
            }

            // 获取最新开奖号码
            const winningNumbers = await api.getLatestDraw();
            if (!winningNumbers) {
                alert('获取开奖号码失败，请稍后重试');
                return;
            }

            // 更新结果表格
            pageHandler.updateResultTable(numbers, winningNumbers);

        } catch (error) {
            console.error('处理查询请求失败:', error);
            alert('处理查询请求失败，请检查号码格式是否正确');
        }
    }
};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    // 获取并显示最新开奖号码
    const latestDraw = await api.getLatestDraw();
    if (latestDraw) {
        pageHandler.updateLatestDraw(latestDraw);
    }

    // 监听表单提交事件
    document.getElementById('check-form').addEventListener('submit', pageHandler.handleSubmit);
}); 