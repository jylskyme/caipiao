# API文档

## 基础信息

- 基础URL：`http://localhost:54321`
- 所有API返回JSON格式数据
- 时间格式：ISO 8601 (YYYY-MM-DD)
- 所有请求使用GET方法

## API端点

### 1. 健康检查

检查API服务是否正常运行。

- 端点：`/api/health`
- 方法：GET
- 参数：无
- 响应示例：
```json
{
    "status": "ok",
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### 2. 获取最新开奖号码

获取最新的开奖结果。

- 端点：`/api/latest`
- 方法：GET
- 参数：
  - count：获取的记录数量（可选，默认为1）
- 响应示例：
```json
[
    {
        "期号": "24147",
        "红球": ["05", "11", "13", "16", "21", "30"],
        "蓝球": "10",
        "开奖日期": "2024-12-22",
        "奖池奖金": "2,158,588,347",
        "一等奖": {
            "注数": "6",
            "奖金": "8,463,788"
        },
        "二等奖": {
            "注数": "120",
            "奖金": "216,486"
        },
        "总投注额": "438,660,552"
    }
]
```

### 3. 获取历史数据

按日期范围获取历史开奖数据。

- 端点：`/api/history`
- 方法：GET
- 参数：
  - startDate：开始日期（YYYY-MM-DD）
  - endDate：结束日期（YYYY-MM-DD）
- 响应示例：
```json
[
    {
        "期号": "24147",
        "红球": ["05", "11", "13", "16", "21", "30"],
        "蓝球": "10",
        "开奖日期": "2024-12-22",
        "奖池奖金": "2,158,588,347",
        "一等奖": {
            "注数": "6",
            "奖金": "8,463,788"
        },
        "二等奖": {
            "注数": "120",
            "奖金": "216,486"
        },
        "总投注额": "438,660,552"
    }
    // ... 更多记录
]
```

### 4. 获取频率分析

获取号码出现频率统计数据。

- 端点：`/api/analysis/frequency`
- 方法：GET
- 参数：无
- 响应示例：
```json
{
    "redBallFrequency": {
        "01": 10,
        "02": 15,
        // ... 其他红球频率
    },
    "blueBallFrequency": {
        "01": 5,
        "02": 8,
        // ... 其他蓝球频率
    }
}
```

## 错误处理

所有API在发生错误时返回统一格式的错误响应：

```json
{
    "error": true,
    "message": "错误描述信息",
    "code": "错误代码"
}
```

### 常见错误代码

- 400：请求参数错误
- 404：资源不存在
- 500：服务器内部错误

## 数据格式说明

### 1. 开奖号码格式
- 红球：长度为2的字符串数组，例如：["01", "02", "03", "04", "05", "06"]
- 蓝球：长度为2的字符串，例如："07"

### 2. 日期格式
- 使用ISO 8601格式：YYYY-MM-DD
- 示例：2024-01-01

### 3. 金额格式
- 使用字符串表示，包含千位分隔符
- 示例：2,158,588,347

## 使用示例

### 使用curl获取最新开奖号码
```bash
curl http://localhost:54321/api/latest?count=1
```

### 使用curl获取历史数据
```bash
curl "http://localhost:54321/api/history?startDate=2024-01-01&endDate=2024-12-31"
```

### 使用JavaScript获取频率分析
```javascript
fetch('http://localhost:54321/api/analysis/frequency')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

## 注意事项

1. 所有请求都应该包含适当的错误处理
2. 建议实现请求重试机制
3. 考虑实现请求缓存以提高性能
4. 注意API调用频率限制 