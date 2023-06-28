import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class ElementPatternDataDto {
  @IsMongoId()
  @ApiProperty({ example: new Types.ObjectId() })
  public readonly id?: Types.ObjectId;

  @ApiProperty({
    type: Object,
    description: 'Pattern Data',
  })
  public readonly customVars: {
    [key: string]: string | undefined;
  };

  constructor(id: Types.ObjectId, customVars: {
    [key: string]?: string | undefined;
  }) {
    this.id = id;
    this.customVars = customVars || {};
  }
}
