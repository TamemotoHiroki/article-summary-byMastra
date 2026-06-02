// 記事内容からトピックやキーワードを抽出（タグ付け）するエージェント
import { Agent } from './agent';
import { Message } from './types';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export class TaggingAgent extends Agent {
  async handleMessage(message: Message): Promise<Message> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `この文章に合うタグを3つ出力してください:
${message.content}` }],
    });

    const tags = completion.choices[0].message.content || '';
    return {
      sender: this.name,
      recipient: 'slack',
      content: `${message.content}

タグ: ${tags}`,
    };
  }
}
