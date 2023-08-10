import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { IsOptional } from 'class-validator';
import { TCustomVars } from '../customVars.type';

export class CreatePatternDataDto {
  @ApiProperty({ example: 'pattern name' })
  public readonly id: Types.ObjectId;

  @ApiProperty({
    type: Object,
    description: 'Pattern Data',
  })
  @IsOptional()
  public readonly customVars: TCustomVars;

  @IsDate()
  @ApiProperty({ example: new Date(Date.now()) })
  public readonly date: Date = new Date(Date.now());

  constructor(id: Types.ObjectId, customVars: TCustomVars) {
    this.id = id;
    this.customVars = customVars || {};
  }
}
