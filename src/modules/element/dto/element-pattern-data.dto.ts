import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

interface ICustomVarsDto {
  [key: string]?: string
}

class CustomVarsDto implements ICustomVarsDto {}

export class ElementPatternDataDto {
  @IsMongoId()
  @ApiProperty({ example: new Types.ObjectId() })
  public readonly id?: Types.ObjectId;

  @ApiProperty({})
  @ValidateNested({ each: true })
  @Type(() => ICustomVarsDto)
  public readonly customVars: ICustomVarsDto;

  constructor(id: Types.ObjectId, customVars: ICustomVarsDto) {
    this.id = id;
    this.customVars = customVars;
  }
}
