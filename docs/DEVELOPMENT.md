# 开发指南

## 开发环境设置

### 1. 必要软件
- Node.js (v14.0.0 或更高版本)
- npm (v6.0.0 或更高版本)
- Git
- 推荐的代码编辑器：VS Code

### 2. VS Code 推荐扩展
- ESLint
- Prettier
- Live Server
- JavaScript (ES6) code snippets
- GitLens

### 3. 环境配置
1. 克隆项目
```bash
git clone [项目地址]
cd [项目目录]
```

2. 安装依赖
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. 配置开发环境
```bash
# 复制配置文件
cp backend/config/default.example.js backend/config/default.js

# 编辑配置文件
vim backend/config/default.js
```

## 项目结构说明

### 前端结构
```
frontend/
├── css/                # 样式文件
│   ├── style.css      # 公共样式
│   ├── analysis.css   # 数据分析页样式
│   └── predict.css    # 预测页样式
├── js/                # JavaScript文件
│   ├── config.js      # 配置文件
│   ├── index.js       # 首页脚本
│   ├── analysis.js    # 数据分析脚本
│   ├── predict.js     # 预测脚本
│   └── check.js       # 中奖查询脚本
└── *.html             # HTML页面
```

### 后端结构
```
backend/
├── config/            # 配置文件
├── data/              # 数据文件
├── scripts/           # 脚本文件
└── src/              # 源代码
    ├── controllers/  # 控制器
    ├── models/       # 数据模型
    ├── routes/       # 路由
    └── services/     # 服务
```

## 开发规范

### 1. 代码风格
- 使用ES6+语法
- 使用2空格缩进
- 使用分号结束语句
- 使用单引号
- 使用驼峰命名法

### 2. 文件命名
- HTML文件：小写，使用连字符
- CSS文件：小写，使用连字符
- JS文件：小写，使用连字符
- 类文件：首字母大写，驼峰命名

### 3. 注释规范
- 使用JSDoc风格的注释
- 每个函数都应该有注释说明
- 复杂逻辑需要添加行内注释

示例：
```javascript
/**
 * 计算中奖等级
 * @param {Object} userNumbers - 用户选择的号码
 * @param {Object} winningNumbers - 开奖号码
 * @returns {Object} 中奖信息
 */
function calculatePrize(userNumbers, winningNumbers) {
    // 实现逻辑
}
```

### 4. Git提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格���修改
- refactor: 重构
- test: 测试用例
- chore: 其他修改

## 开发流程

### 1. 功能开发
1. 创建功能分支
```bash
git checkout -b feature/功能名称
```

2. 开发功能
3. 提交代码
```bash
git add .
git commit -m "feat: 添加新功能"
```

4. 推送分支
```bash
git push origin feature/功能名称
```

5. 创建Pull Request

### 2. Bug修复
1. 创建修复分支
```bash
git checkout -b fix/bug描述
```

2. 修复bug
3. 提交代码
```bash
git add .
git commit -m "fix: 修复bug"
```

4. 推送分支
```bash
git push origin fix/bug描述
```

5. 创建Pull Request

## 测试指南

### 1. 单元测试
- 使用Jest进行测试
- 测试文件以.test.js结尾
- 运行测试：`npm test`

### 2. API测试
- 使用Postman或curl测试API
- 检查响应状态码和数据格式
- 测试错误处理

### 3. 前端测试
- 在不同浏览器中测试
- 测试响应式布局
- 验证用户交互

## 调试技巧

### 1. 后端调试
- 使用console.log()输出调试信息
- 使用Node.js调试器
- 检查API响应

### 2. 前端调试
- 使用浏览器开发者工具
- 检查Console面板的错误信息
- 使用Network面板检查API请求

### 3. 常见问题
- 跨域问题解决
- 数据格式处理
- 异步操作处理

## 部署说明

### 1. 开发环境
```bash
# 启动后端服务
cd backend
node server.js

# 启动前端服务
cd frontend
# 使用任意Web服务器
```

### 2. 生产环境
- 使用PM2管理Node.js进程
- 配置Nginx反向代理
- 启用HTTPS
- 配置数据备份

## 性能优化

### 1. 前端优化
- 压缩静态资源
- 使用CDN
- 实现懒加载
- 优化图片

### 2. 后端优化
- 实现缓存机制
- 优化数据库查询
- 实现请求限流
- 错误日志记录

## 安全考虑

### 1. 前端安全
- 输入验证
- XSS防护
- CSRF防护

### 2. 后端安全
- 参数验证
- 错误处理
- 日志记录
- 数据备份

## 文档维护

### 1. 代码文档
- 及时更新注释
- 保持README.md最新
- 记录重要的更改

### 2. API文档
- 保持API文档最新
- 记录所有接口变更
- 提供使用示例

## 联系方式

如有问题，请联系：
- 项目负责人：[姓名]
- 邮箱：[邮箱地址]
- 项目仓库：[仓库地址] 