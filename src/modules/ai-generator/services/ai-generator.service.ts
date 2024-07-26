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
    conole.log('entered to ai generation');

    try {
      if(aiGeneratorPromt.chatgptKey) {
        conole.log('preparing ai generation');
        const config = aiGeneratorPromt.chatgptOrganizationId ?
        { apiKey: aiGeneratorPromt.chatgptKey, organization: aiGeneratorPromt.chatgptOrganizationId } :
        { apiKey: aiGeneratorPromt.chatgptKey};
          
        conole.log('started ai generation');
        const openai = new OpenAI(config);
  
        const response = await openai.chat.completions.create({
          messages: [{ role: 'user', content: aiGeneratorPromt.chatgptPromt }],
          model: aiGeneratorPromt.chatgptModelVersion || 'gpt-4o'
        });
        conole.log('ended ai generation');
        return Promise.resolve(response.choices[0].message.content || '');
      }  else {
        throw new Error('Empty chartgpt key');
      }
    } catch(e) {
      conole.log(`Error: ${e}`);
      return Promise.reject(e);
    }
  };
}
