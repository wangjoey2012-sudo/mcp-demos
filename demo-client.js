#!/usr/bin/env node

/**
 * MCP Demo Client - 用于测试演示
 *
 * 这个客户端可以直接与 MCP servers 交互，方便演示和测试
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testToolsDemo() {
  console.log('\n🔧 ========== Tools Demo 测试 ==========\n');

  const serverProcess = spawn('node', ['1-tools-demo.js'], {
    cwd: process.cwd(),
  });

  const transport = new StdioClientTransport({
    command: 'node',
    args: ['1-tools-demo.js'],
  });

  const client = new Client(
    {
      name: 'demo-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  // 1. 列出所有工具
  console.log('📋 可用工具列表：');
  const tools = await client.listTools();
  tools.tools.forEach((tool, i) => {
    console.log(`  ${i + 1}. ${tool.name} - ${tool.description}`);
  });

  // 2. 测试计算工具
  console.log('\n🧮 测试计算工具：123 + 456');
  const calcResult = await client.callTool({
    name: 'calculate',
    arguments: {
      operation: 'add',
      a: 123,
      b: 456,
    },
  });
  console.log(`  结果: ${calcResult.content[0].text}`);

  // 3. 测试天气工具
  console.log('\n🌤️  测试天气工具：查询北京天气');
  const weatherResult = await client.callTool({
    name: 'get_weather',
    arguments: {
      city: 'beijing',
    },
  });
  console.log(`  结果:\n${weatherResult.content[0].text}`);

  await client.close();
  serverProcess.kill();

  console.log('\n✅ Tools Demo 测试完成\n');
}

async function testResourcesDemo() {
  console.log('\n📚 ========== Resources Demo 测试 ==========\n');

  const transport = new StdioClientTransport({
    command: 'node',
    args: ['2-resources-demo.js'],
  });

  const client = new Client(
    {
      name: 'demo-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  // 1. 列出所有资源
  console.log('📋 可用资源列表：');
  const resources = await client.listResources();
  resources.resources.forEach((resource, i) => {
    console.log(`  ${i + 1}. ${resource.name} (${resource.uri})`);
    console.log(`     ${resource.description}`);
  });

  // 2. 读取用户列表
  console.log('\n👥 读取用户列表资源：');
  const usersResult = await client.readResource({
    uri: 'data://users',
  });
  console.log('  内容:');
  const users = JSON.parse(usersResult.contents[0].text);
  users.forEach(user => {
    console.log(`    - ${user.name} (${user.role})`);
  });

  // 3. 读取产品目录
  console.log('\n🛍️  读取产品目录资源：');
  const productsResult = await client.readResource({
    uri: 'data://products',
  });
  console.log('  内容:');
  const products = JSON.parse(productsResult.contents[0].text);
  products.forEach(product => {
    console.log(`    - ${product.name}: ¥${product.price}`);
  });

  await client.close();

  console.log('\n✅ Resources Demo 测试完成\n');
}

async function testPromptsDemo() {
  console.log('\n📋 ========== Prompts Demo 测试 ==========\n');

  const transport = new StdioClientTransport({
    command: 'node',
    args: ['3-prompts-demo.js'],
  });

  const client = new Client(
    {
      name: 'demo-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  // 1. 列出所有提示模板
  console.log('📋 可用提示模板列表：');
  const prompts = await client.listPrompts();
  prompts.prompts.forEach((prompt, i) => {
    console.log(`  ${i + 1}. ${prompt.name} - ${prompt.description}`);
    if (prompt.arguments && prompt.arguments.length > 0) {
      console.log(`     参数: ${prompt.arguments.map(a => a.name).join(', ')}`);
    }
  });

  // 2. 获取代码审查模板
  console.log('\n📝 获取代码审查模板：');
  const codeReviewPrompt = await client.getPrompt({
    name: 'code_review',
    arguments: {
      code: 'function add(a, b) { return a + b; }',
      language: 'JavaScript',
    },
  });
  console.log(`  描述: ${codeReviewPrompt.description}`);
  console.log(`  提示长度: ${codeReviewPrompt.messages[0].content.text.length} 字符`);
  console.log(`  提示预览:\n${codeReviewPrompt.messages[0].content.text.substring(0, 200)}...`);

  await client.close();

  console.log('\n✅ Prompts Demo 测试完成\n');
}

async function main() {
  console.log('🚀 MCP 三大核心概念演示\n');
  console.log('本演示将依次测试 Tools、Resources 和 Prompts\n');

  try {
    await testToolsDemo();
    await testResourcesDemo();
    await testPromptsDemo();

    console.log('\n🎉 所有测试完成！\n');
    console.log('💡 提示：');
    console.log('  - 配置文件已创建: ~/Library/Application Support/Claude/claude_desktop_config.json');
    console.log('  - 重启 Claude Desktop 即可使用这些 MCP servers');
    console.log('  - 在 Claude 中尝试: "帮我计算 100 + 200" 或 "显示用户列表"\n');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

main();
