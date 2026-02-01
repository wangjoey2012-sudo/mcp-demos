# MCP 核心概念演示

> 通过三个实际可运行的示例，深入理解 Model Context Protocol (MCP) 的三大核心概念：**Tools**、**Resources** 和 **Prompts**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

---

## 🎯 项目简介

这个项目包含三个独立的 MCP Server 实现，每个都清晰地展示了 MCP 的一个核心概念：

| 概念 | 文件 | 说明 | 实际应用 |
|------|------|------|----------|
| **🔧 Tools** | `1-tools-demo.js` | 让 AI 执行操作 | 计算器、天气查询 |
| **📚 Resources** | `2-resources-demo.js` | 让 AI 访问数据 | 用户列表、产品目录 |
| **📋 Prompts** | `3-prompts-demo.js` | 标准化工作流程 | 代码审查、文档生成 |

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm
- Claude Desktop（可选，用于实际体验）

### 安装

```bash
# 克隆仓库
git clone https://github.com/你的用户名/mcp-demos.git
cd mcp-demos

# 安装依赖
npm install
```

### 命令行测试

```bash
# 运行测试客户端，查看所有功能演示
node demo-client.js
```

### 在 Claude Desktop 中使用

1. 编辑 Claude Desktop 配置文件：
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. 添加以下配置（修改路径为你的实际路径）：

```json
{
  "mcpServers": {
    "tools-demo": {
      "command": "node",
      "args": ["/path/to/mcp-demos/1-tools-demo.js"]
    },
    "resources-demo": {
      "command": "node",
      "args": ["/path/to/mcp-demos/2-resources-demo.js"]
    },
    "prompts-demo": {
      "command": "node",
      "args": ["/path/to/mcp-demos/3-prompts-demo.js"]
    }
  }
}
```

3. 重启 Claude Desktop

4. 在对话中测试：
   - "帮我计算 100 + 200"
   - "显示用户列表"
   - 选择提示模板使用

---

## 📚 三大核心概念详解

### 1️⃣ Tools（工具）

**概念**：让 Claude 调用外部功能来执行操作。

**演示内容**：
- ✅ `calculate` - 数学计算器（加减乘除）
- ✅ `get_weather` - 天气查询工具

**关键代码**：
```javascript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: 'calculate',
      description: '执行基本的数学计算',
      inputSchema: { /* ... */ }
    }]
  };
});
```

**应用场景**：
- 数据库操作
- API 调用
- 发送通知
- 文件操作

---

### 2️⃣ Resources（资源）

**概念**：让 Claude 访问外部数据源，获取上下文信息。

**演示内容**：
- ✅ `data://users` - 用户列表
- ✅ `data://products` - 产品目录
- ✅ `data://config` - 系统配置
- ✅ `data://users/{id}` - 单个用户详情

**关键代码**：
```javascript
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [{
      uri: 'data://users',
      name: '用户列表',
      mimeType: 'application/json'
    }]
  };
});
```

**应用场景**：
- 文件系统访问
- 数据库查询
- API 数据源
- 配置管理

---

### 3️⃣ Prompts（提示模板）

**概念**：提供预定义的提示模板，标准化常见任务。

**演示内容**：
- ✅ `code_review` - 代码审查模板
- ✅ `generate_docs` - 文档生成模板
- ✅ `bug_analysis` - Bug 分析模板
- ✅ `api_design` - API 设计模板

**关键代码**：
```javascript
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [{
      name: 'code_review',
      description: '对代码进行全面的审查',
      arguments: [/* ... */]
    }]
  };
});
```

**应用场景**：
- 代码质量检查
- 文档标准化
- 工作流程模板
- 团队最佳实践

---

## 📁 项目结构

```
mcp-demos/
├── 1-tools-demo.js                    # Tools 实现
├── 2-resources-demo.js                # Resources 实现
├── 3-prompts-demo.js                  # Prompts 实现
├── demo-client.js                     # 测试客户端
├── package.json                       # 项目配置
├── README.md                          # 项目说明
├── 快速演示指南.md                    # 演示脚本
├── 测试说明.md                        # 测试文档
└── claude_desktop_config.example.json # 配置示例
```

---

## 🎬 演示效果

### Tools Demo 输出
```
🧮 计算 123 + 456
   → 结果: 579

🌤️ 查询北京天气
   → 温度: 5°C
   → 天气: 晴天
   → 湿度: 45%
```

### Resources Demo 输出
```
👥 用户列表：
   - 张三 (开发工程师)
   - 李四 (产品经理)
   - 王五 (设计师)
```

### Prompts Demo 输出
```
📋 可用模板：
   1. code_review - 代码审查
   2. generate_docs - 生成文档
   3. bug_analysis - Bug 分析
   4. api_design - API 设计
```

---

## 🔧 核心概念对比

| 维度 | Tools | Resources | Prompts |
|------|-------|-----------|---------|
| **用途** | 执行操作 | 提供数据 | 标准化任务 |
| **方向** | Claude → 外部 | 外部 → Claude | 模板 → Claude |
| **修改状态** | ✅ 是 | ❌ 否 | ❌ 否 |
| **实时性** | 高 | 高 | 低（静态） |
| **复杂度** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

---

## 🛠️ 扩展建议

基于这些演示，你可以创建：

### Tools 扩展
- 数据库 CRUD 操作
- 邮件/消息发送
- 文件系统管理
- 第三方服务集成

### Resources 扩展
- Git 仓库信息
- 日志文件访问
- 实时监控数据
- 配置中心集成

### Prompts 扩展
- 测试用例生成
- 代码重构指南
- 安全审计清单
- 项目文档模板

---

## 📖 相关文档

- [MCP 官方文档](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://claude.ai/download)
- [更多 MCP Servers](https://github.com/modelcontextprotocol/servers)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

适用于技术学习和公众号文章演示

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**
