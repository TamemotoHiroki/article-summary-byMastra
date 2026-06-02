import { Message } from './types';

export abstract class Agent {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  abstract handleMessage(message: Message): Promise<Message | void>;
}
