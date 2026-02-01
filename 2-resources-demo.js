#!/usr/bin/env node

/**
 * MCP Resources Demo - 资源演示
 *
 * 这个示例展示如何通过 MCP 提供资源给 Claude 访问
 * 示例：提供用户数据、产品目录等结构化数据资源
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 创建 MCP Server
const server = new Server(
  {
    name: 'resources-demo-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},  // 声明支持 resources 功能
    },
  }
);

// 模拟数据库
const database = {
  users: [
    { id: 1, name: '张三', role: '开发工程师', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', role: '产品经理', email: 'lisi@example.com' },
    { id: 3, name: '王五', role: '设计师', email: 'wangwu@example.com' },
  ],
  products: [
    { id: 101, name: 'Claude Pro', price: 20, category: 'AI服务' },
    { id: 102, name: 'API访问', price: 0.01, category: 'AI服务' },
    { id: 103, name: '企业版', price: 100, category: 'AI服务' },
  ],
  config: {
    appName: 'MCP Demo App',
    version: '1.0.0',
    maxUsers: 1000,
    features: ['tools', 'resources', 'prompts'],
  },
};

// 1️⃣ 列出所有可用资源
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'data://users',
        name: '用户列表',
        description: '系统中所有用户的信息',
        mimeType: 'application/json',
      },
      {
        uri: 'data://products',
        name: '产品目录',
        description: '所有可用产品的列表和价格',
        mimeType: 'application/json',
      },
      {
        uri: 'data://config',
        name: '系统配置',
        description: '应用程序的配置信息',
        mimeType: 'application/json',
      },
      {
        uri: 'data://users/1',
        name: '用户详情 - 张三',
        description: 'ID为1的用户详细信息',
        mimeType: 'application/json',
      },
    ],
  };
});

// 2️⃣ 读取具体资源
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    // 解析 URI
    if (uri === 'data://users') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(database.users, null, 2),
          },
        ],
      };
    }

    if (uri === 'data://products') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(database.products, null, 2),
          },
        ],
      };
    }

    if (uri === 'data://config') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(database.config, null, 2),
          },
        ],
      };
    }

    // 处理特定用户资源
    if (uri.startsWith('data://users/')) {
      const userId = parseInt(uri.split('/').pop());
      const user = database.users.find((u) => u.id === userId);

      if (!user) {
        throw new Error(`未找到用户 ID: ${userId}`);
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(user, null, 2),
          },
        ],
      };
    }

    throw new Error(`未知的资源 URI: ${uri}`);
  } catch (error) {
    throw new Error(`读取资源失败: ${error.message}`);
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Resources Demo MCP Server 已启动');
}

main().catch((error) => {
  console.error('服务器错误:', error);
  process.exit(1);
});
