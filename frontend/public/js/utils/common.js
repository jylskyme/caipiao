// 公共工具函数
const utils = {
    // 格式化日期
    formatDate(date) {
        return new Date(date).toLocaleDateString('zh-CN');
    },

    // 格式化数字
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // 获取API数据
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('网络请求失败');
            }
            return await response.json();
        } catch (error) {
            console.error('数据获取错误:', error);
            throw error;
        }
    }
};

// 导出工具函数
window.utils = utils; 