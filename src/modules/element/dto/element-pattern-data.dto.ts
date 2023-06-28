import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

type TCustomVars = {
  [key: string]: string;
};

export class ElementPatternDataDto {
  @IsMongoId()
  @ApiProperty({ example: new Types.ObjectId() })
  public readonly id?: Types.ObjectId;

  @ApiProperty({
    type: {
      url: 'https://www.wikipedia.org/'
    },
    description: 'Pattern Data'
  })
  public readonly customVars: TCustomVars;

  constructor(id: Types.ObjectId, customVars: TCustomVars) {
    this.id = id;
    this.customVars = customVars || {};
  }
}
