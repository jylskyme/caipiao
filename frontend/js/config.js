const config = {
    apiBaseUrl: 'http://127.0.0.1:54321',
    endpoints: {
        latest: '/api/latest',
        history: '/api/history',
        frequency: '/api/analysis/frequency'
    },
    refreshInterval: 60000,  // 数据刷新间隔（毫秒）
    dateFormat: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }
}; 