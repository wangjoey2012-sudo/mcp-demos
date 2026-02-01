#!/usr/bin/env node

/**
 * MCP Prompts Demo - 提示模板演示
 *
 * 这个示例展示如何通过 MCP 提供预定义的提示模板
 * 示例：代码审查、文档生成、Bug分析等常用提示模板
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 创建 MCP Server
const server = new Server(
  {
    name: 'prompts-demo-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      prompts: {},  // 声明支持 prompts 功能
    },
  }
);

// 1️⃣ 列出所有可用的提示模板
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'code_review',
        description: '对代码进行全面的审查，检查质量、性能和最佳实践',
        arguments: [
          {
            name: 'code',
            description: '要审查的代码',
            required: true,
          },
          {
            name: 'language',
            description: '编程语言（如：JavaScript, Python, Java）',
            required: true,
          },
        ],
      },
      {
        name: 'generate_docs',
        description: '为代码生成详细的文档',
        arguments: [
          {
            name: 'code',
            description: '要生成文档的代码',
            required: true,
          },
          {
            name: 'format',
            description: '文档格式（如：markdown, jsdoc, sphinx）',
            required: false,
          },
        ],
      },
      {
        name: 'bug_analysis',
        description: '分析Bug报告并提供解决方案',
        arguments: [
          {
            name: 'bug_description',
            description: 'Bug的详细描述',
            required: true,
          },
          {
            name: 'error_logs',
            description: '相关的错误日志',
            required: false,
          },
        ],
      },
      {
        name: 'api_design',
        description: '设计RESTful API接口',
        arguments: [
          {
            name: 'feature',
            description: '要实现的功能描述',
            required: true,
          },
          {
            name: 'resources',
            description: '涉及的资源类型',
            required: true,
          },
        ],
      },
    ],
  };
});

// 2️⃣ 获取具体的提示模板内容
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'code_review') {
      const { code, language } = args || {};

      if (!code) {
        throw new Error('缺少必需参数：code');
      }
      if (!language) {
        throw new Error('缺少必需参数：language');
      }

      return {
        description: `对 ${language} 代码进行审查`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请对以下 ${language} 代码进行全面审查：

\`\`\`${language}
${code}
\`\`\`

请从以下几个方面进行审查：
1. **代码质量**：可读性、命名规范、代码结构
2. **性能问题**：潜在的性能瓶颈或优化建议
3. **安全性**：可能的安全漏洞
4. **最佳实践**：是否遵循该语言的最佳实践
5. **Bug风险**：可能导致Bug的代码模式

请提供具体的改进建议和示例代码。`,
            },
          },
        ],
      };
    }

    if (name === 'generate_docs') {
      const { code, format = 'markdown' } = args || {};

      if (!code) {
        throw new Error('缺少必需参数：code');
      }

      return {
        description: `生成 ${format} 格式的代码文档`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请为以下代码生成详细的文档（格式：${format}）：

\`\`\`
${code}
\`\`\`

文档应包含：
1. **功能概述**：代码的主要功能和用途
2. **参数说明**：每个参数的类型、描述和默认值
3. **返回值**：返回值的类型和说明
4. **使用示例**：1-2个实际使用示例
5. **注意事项**：使用时需要注意的事项

请使用 ${format} 格式输出。`,
            },
          },
        ],
      };
    }

    if (name === 'bug_analysis') {
      const { bug_description, error_logs = '无' } = args || {};

      if (!bug_description) {
        throw new Error('缺少必需参数：bug_description');
      }

      return {
        description: '分析Bug并提供解决方案',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请分析以下Bug并提供解决方案：

**Bug描述：**
${bug_description}

**错误日志：**
${error_logs}

请提供：
1. **根因分析**：Bug的可能原因
2. **重现步骤**：如何重现这个问题
3. **解决方案**：详细的修复步骤和代码示例
4. **预防措施**：如何避免类似问题
5. **测试建议**：如何验证修复是否有效`,
            },
          },
        ],
      };
    }

    if (name === 'api_design') {
      const { feature, resources } = args || {};

      if (!feature) {
        throw new Error('缺少必需参数：feature');
      }
      if (!resources) {
        throw new Error('缺少必需参数：resources');
      }

      return {
        description: '设计RESTful API',
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `请设计以下功能的RESTful API接口：

**功能需求：**
${feature}

**涉及的资源：**
${resources}

请提供：
1. **接口列表**：所有需要的API端点（GET/POST/PUT/DELETE）
2. **请求格式**：每个接口的请求参数和body结构
3. **响应格式**：成功和失败情况的响应示例
4. **状态码**：使用的HTTP状态码
5. **认证方式**：API的认证和授权机制
6. **错误处理**：统一的错误响应格式

请使用Markdown表格和代码块展示。`,
            },
          },
        ],
      };
    }

    throw new Error(`未知的提示模板: ${name}`);
  } catch (error) {
    throw new Error(`获取提示失败: ${error.message}`);
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Prompts Demo MCP Server 已启动');
}

main().catch((error) => {
  console.error('服务器错误:', error);
  process.exit(1);
});
