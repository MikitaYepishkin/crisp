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
    console.log('entered to ai generation');

    try {
      if(aiGeneratorPromt.chatgptKey) {
        console.log('preparing ai generation');
        const config = aiGeneratorPromt.chatgptOrganizationId ?
        { apiKey: aiGeneratorPromt.chatgptKey, organization: aiGeneratorPromt.chatgptOrganizationId } :
        { apiKey: aiGeneratorPromt.chatgptKey};
          
        console.log('started ai generation');
        const openai = new OpenAI(config);
  
        const response = await openai.chat.completions.create({
          messages: [{ role: 'user', content: aiGeneratorPromt.chatgptPromt }],
          model: aiGeneratorPromt.chatgptModelVersion || 'gpt-4o'
        });
        console.log('ended ai generation');
        return Promise.resolve(response.choices[0].message.content || '');
      }  else {
        throw new Error('Empty chartgpt key');
      }
    } catch(e) {
      console.log(`Error: ${e}`);
      return Promise.reject(e);
    }
  };
}
