// デモ用ラッパー - 元のコードを修正せずに動作を可視化
import * as dotenv from 'dotenv';
dotenv.config();

import { ScraperAgent } from './scraperAgent';
import { SummaryAgent } from './summaryAgent';
import { TaggingAgent } from './taggingAgent';
import { SlackAgent } from './slackAgent';
import { Message } from './types';

// 色付きログ用
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

function log(agent: string, message: string, color: string = colors.reset) {
  const timestamp = new Date().toLocaleTimeString('ja-JP');
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${color}${colors.bright}[${agent}]${colors.reset} ${message}`);
}

function separator() {
  console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('\n');
  console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║    📰 記事要約マルチエージェントシステム デモ            ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('\n');

  // エージェント初期化
  const scraperAgent = new ScraperAgent('scraper');
  const summaryAgent = new SummaryAgent('summary');
  const taggingAgent = new TaggingAgent('tagger');
  const slackAgent = new SlackAgent('slack');

  log('SYSTEM', '🚀 処理を開始します...', colors.cyan);
  separator();

  // Step 1: スクレイピング
  log('ScraperAgent', '📡 Zenn RSSフィードから最新記事を取得中...', colors.green);
  await sleep(500);
  
  const scraperResult = await scraperAgent.handleMessage({ 
    sender: 'system', 
    recipient: 'scraper', 
    content: 'start' 
  });
  
  log('ScraperAgent', `✅ 記事を発見: ${scraperResult.content}`, colors.green);
  separator();

  // Step 2: 要約
  log('SummaryAgent', '🤖 OpenAI GPT-4 で記事を要約中...', colors.yellow);
  log('SummaryAgent', '   └─ Webページをスクレイピング中...', colors.yellow);
  await sleep(300);
  log('SummaryAgent', '   └─ LLMに送信中...', colors.yellow);
  
  const summaryResult = await summaryAgent.handleMessage(scraperResult);
  
  log('SummaryAgent', '✅ 要約完了!', colors.yellow);
  console.log(`${colors.dim}┌─────────────────────────────────────────────────────────────┐${colors.reset}`);
  summaryResult.content.split('\n').forEach(line => {
    console.log(`${colors.dim}│${colors.reset} ${line.substring(0, 57).padEnd(57)} ${colors.dim}│${colors.reset}`);
  });
  console.log(`${colors.dim}└─────────────────────────────────────────────────────────────┘${colors.reset}`);
  separator();

  // Step 3: タグ付け
  log('TaggingAgent', '🏷️  記事にタグを付与中...', colors.magenta);
  log('TaggingAgent', '   └─ キーワード分析中...', colors.magenta);
  
  const taggingResult = await taggingAgent.handleMessage(summaryResult);
  
  log('TaggingAgent', '✅ タグ付け完了!', colors.magenta);
  separator();

  // 最終結果表示
  console.log('\n');
  console.log(`${colors.bright}${colors.blue}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}║                    📋 最終結果                            ║${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}╚════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  console.log(taggingResult.content);
  console.log('');
  separator();

  // Step 4: Slack送信
  log('SlackAgent', '📤 Slackにメッセージを送信中...', colors.blue);
  log('SlackAgent', '   └─ #general チャンネルに投稿中...', colors.blue);
  
  await slackAgent.handleMessage(taggingResult);
  
  log('SlackAgent', '✅ Slack送信完了!', colors.blue);
  separator();
  
  log('SYSTEM', '🎉 全ての処理が正常に完了しました!', colors.cyan);
  console.log('\n');
}

main().catch(err => {
  console.error(`${colors.reset}❌ エラー:`, err.message);
  process.exit(1);
});

