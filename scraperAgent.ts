// 指定したRSSフィードを取得し、新着記事のタイトルや本文を抽出するエージェント
import { Agent } from './agent';
import { Message } from './types';
import Parser from 'rss-parser';

export class ScraperAgent extends Agent {
  async handleMessage(_msg: Message): Promise<Message> {
    const parser = new Parser();
    const feed = await parser.parseURL('https://zenn.dev/feed');
    const first = feed.items[0];
    return {
      sender: this.name,
      recipient: 'summary',
      content: first.link || '',
    };
  }
}
