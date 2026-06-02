// LLMを使用してウェブページの内容を要約するエージェント
import { Agent } from './agent';
import { Message } from './types';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export class SummaryAgent extends Agent {
  async handleMessage(message: Message): Promise<Message> {
    const res = await axios.get(message.content);
    const $ = cheerio.load(res.data);
    const text = $('body').text().substring(0, 1000);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `次の文章を3行で要約してください:
${text}` }],
    });

    const summary = completion.choices[0].message.content || '';
    return {
      sender: this.name,
      recipient: 'tagger',
      content: summary,
    };
  }
}
