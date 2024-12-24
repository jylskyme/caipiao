document.addEventListener('DOMContentLoaded', function() {
    // 更新频率表格
    function updateFrequencyTables() {
        const { redFreq, blueFreq } = calculateBallFrequency(historyData.drawHistory);
        
        // 红球频率表格
        const redBody = document.getElementById('redFrequencyBody');
        const redRows = Object.entries(redFreq)
            .sort((a, b) => a[1].count - b[1].count) // 按出现次数升序排序
            .map(([number, data]) => `
                <tr>
                    <td><span class="ball red small">${number.padStart(2, '0')}</span></td>
                    <td>${data.count}</td>
                    <td>${data.percentage}</td>
                    <td>${data.lastAppearance}期前</td>
                </tr>
            `);
        redBody.innerHTML = redRows.join('');

        // 蓝球频率表格
        const blueBody = document.getElementById('blueFrequencyBody');
        const blueRows = Object.entries(blueFreq)
            .sort((a, b) => a[1].count - b[1].count) // 按出现次数升序排序
            .map(([number, data]) => `
                <tr>
                    <td><span class="ball blue small">${number.padStart(2, '0')}</span></td>
                    <td>${data.count}</td>
                    <td>${data.percentage}</td>
                    <td>${data.lastAppearance}期前</td>
                </tr>
            `);
        blueBody.innerHTML = blueRows.join('');
    }

    // 生成预测号码（基于低频号码）
    function generatePrediction() {
        const { redFreq, blueFreq } = calculateBallFrequency(historyData.drawHistory);
        
        // 选择出现次数最少的6个红球
        const redPredictions = Object.entries(redFreq)
            .sort((a, b) => a[1].count - b[1].count)
            .slice(0, 6)
            .map(([number]) => parseInt(number))
            .sort((a, b) => a - b);
        
        // 选择出现次数最少的蓝球
        const bluePrediction = parseInt(Object.entries(blueFreq)
            .sort((a, b) => a[1].count - b[1].count)[0][0]);
        
        return {
            redBalls: redPredictions,
            blueBall: bluePrediction,
            confidence: 75 // 基于历史数据的置信度
        };
    }

    // 切换频率表格显示
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabType = this.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.frequency-table-container').forEach(t => t.classList.add('hidden'));
            this.classList.add('active');
            document.getElementById(`${tabType}FrequencyTable`).classList.remove('hidden');
        });
    });

    // 初始化页面
    updateFrequencyTables();
    updatePredictionHistory();
}); 