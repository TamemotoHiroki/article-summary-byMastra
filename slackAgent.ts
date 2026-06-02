// 最終的なメッセージをSlackに送信するエージェント
import { Agent } from './agent';
import { Message } from './types';
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN!);

export class SlackAgent extends Agent {
  async handleMessage(message: Message): Promise<void> {
    await slack.chat.postMessage({
      channel: '#general',
      text: message.content,
    });
  }
}
