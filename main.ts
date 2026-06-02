// メイン処理部
import * as dotenv from 'dotenv';
dotenv.config(); // 環境変数を読み込む

import { ScraperAgent } from './scraperAgent';
import { SummaryAgent } from './summaryAgent';
import { TaggingAgent } from './taggingAgent';
import { SlackAgent } from './slackAgent';
import { Message } from './types';

const agents = {
  scraper: new ScraperAgent('scraper'),
  summary: new SummaryAgent('summary'),
  tagger: new TaggingAgent('tagger'),
  slack: new SlackAgent('slack'),
};

async function dispatch(message: Message) {
  const agent = agents[message.recipient as keyof typeof agents];
  if (!agent) return;
  const result = await agent.handleMessage(message);
  if (result) dispatch(result);
}

dispatch({ sender: 'system', recipient: 'scraper', content: 'start' });
