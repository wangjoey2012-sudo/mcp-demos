#!/usr/bin/env node

/**
 * MCP Tools Demo - 工具演示
 *
 * 这个示例展示如何通过 MCP 暴露工具给 Claude 使用
 * 示例：一个简单的计算器和天气查询工具
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 创建 MCP Server
const server = new Server(
  {
    name: 'tools-demo-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},  // 声明支持 tools 功能
    },
  }
);

// 模拟天气数据库
const weatherData = {
  'beijing': { temp: 5, condition: '晴天', humidity: 45 },
  'shanghai': { temp: 12, condition: '多云', humidity: 65 },
  'guangzhou': { temp: 20, condition: '小雨', humidity: 80 },
  'shenzhen': { temp: 22, condition: '晴天', humidity: 70 },
};

// 1️⃣ 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate',
        description: '执行基本的数学计算（加、减、乘、除）',
        inputSchema: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              enum: ['add', 'subtract', 'multiply', 'divide'],
              description: '要执行的运算类型',
            },
            a: {
              type: 'number',
              description: '第一个数字',
            },
            b: {
              type: 'number',
              description: '第二个数字',
            },
          },
          required: ['operation', 'a', 'b'],
        },
      },
      {
        name: 'get_weather',
        description: '获取指定城市的天气信息',
        inputSchema: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: '城市名称（拼音小写，如：beijing, shanghai）',
            },
          },
          required: ['city'],
        },
      },
    ],
  };
});

// 2️⃣ 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'calculate') {
      const { operation, a, b } = args;
      let result;

      switch (operation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0) {
            throw new Error('除数不能为零');
          }
          result = a / b;
          break;
        default:
          throw new Error(`未知的运算类型: ${operation}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `计算结果: ${a} ${operation} ${b} = ${result}`,
          },
        ],
      };
    }

    if (name === 'get_weather') {
      const { city } = args;
      const weather = weatherData[city.toLowerCase()];

      if (!weather) {
        return {
          content: [
            {
              type: 'text',
              text: `未找到城市 "${city}" 的天气信息。支持的城市：${Object.keys(weatherData).join(', ')}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `${city} 的天气:\n温度: ${weather.temp}°C\n天气: ${weather.condition}\n湿度: ${weather.humidity}%`,
          },
        ],
      };
    }

    throw new Error(`未知的工具: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `错误: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Tools Demo MCP Server 已启动');
}

main().catch((error) => {
  console.error('服务器错误:', error);
  process.exit(1);
});
