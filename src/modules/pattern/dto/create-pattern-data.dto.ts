import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class CreatePatternDataDto {
  @ApiProperty({ example: 'pattern name' })
  public readonly id: Types.ObjectId;

  @ApiProperty({
    type: Object,
    description: 'Pattern Data',
  })
  public readonly customVars: {
    [key: string]: string | undefined;
  };

  @IsDate()
  @ApiProperty({ example: new Date(Date.now()) })
  public readonly date: Date = new Date(Date.now());
}
