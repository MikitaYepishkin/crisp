import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class DefaultDataAiGeneratorDto {
  @IsString()
  @IsUrl()
  @ApiProperty({ example: 'https://pl.wikipedia.org/wiki' })
  public readonly currentUrl: string = '';
}
