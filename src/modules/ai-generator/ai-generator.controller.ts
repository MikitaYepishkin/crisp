import {
  Controller,
  Get,
  Body,
  UseGuards,
  ValidationPipe,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { AIGeneratorService } from './services';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AIGeneratorPromtDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('ai-generator')
@Controller('ai-generator')
export class AIGeneratorController {
  constructor(private readonly aiGeneratorService: AIGeneratorService) {}

  @Get('/default-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get default promts',
  })
  public async getAIGenerator(): Promise<string> {
    return this.aiGeneratorService.getDefaultAIGeneratorPromt();
  }

  @Post('/generate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'generate test',
  })
  @ApiBody({ type: AIGeneratorPromtDto })
  public async createAIGenerator(
    @Body(new ValidationPipe()) aiGeneratorPromt: AIGeneratorPromtDto,
  ): Promise<string> {
    return this.aiGeneratorService.generatePageTest(
      aiGeneratorPromt
    );
  }
}
