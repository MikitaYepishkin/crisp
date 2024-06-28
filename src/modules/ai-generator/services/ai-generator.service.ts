import { Injectable } from '@nestjs/common';
import { DEFAULT_DATA } from '../constant/ai-generator.constant';
import OpenAI from 'openai';
import { AIGeneratorPromtDto } from '../dto/update-ai-generator.dto';

@Injectable()
export class AIGeneratorService {
  constructor() {}

  public async getDefaultAIGeneratorPromt(): Promise<string> {
    try {
      return Promise.resolve(JSON.stringify(DEFAULT_DATA));
    } catch(e) {
      return Promise.reject(e);
    }
  }


  /*
    chatgptKey: string = '',
    chatgptPromt: string = '',
    chatgptOrganizationId: string = '',
    chatgptModelVersion: string = ''
  */
  public async generatePageTest(
    aiGeneratorPromt: AIGeneratorPromtDto
  ): Promise<string> {
    try {
      const config = aiGeneratorPromt.chatgptOrganizationId ?
        { apiKey: aiGeneratorPromt.chatgptKey, organization: aiGeneratorPromt.chatgptOrganizationId } :
        { apiKey: aiGeneratorPromt.chatgptKey};
          
          
      const openai = new OpenAI(config);

      const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: aiGeneratorPromt.chatgptPromt }],
        model: aiGeneratorPromt.chatgptModelVersion || 'gpt-4o'
      });

      return Promise.resolve(response.choices[0].message.content || '');
    } catch(e) {
      return Promise.reject(e);
    }
  };
}
