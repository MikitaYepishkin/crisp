import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class ElementPatternDataDto {
  @IsMongoId()
  @ApiProperty({ example: new Types.ObjectId() })
  public readonly id?: Types.ObjectId;

  @ApiProperty({ example: { url: 'https://pl.wikipedia.org/wiki/Wikipedia:Strona_g%C5%82%C3%B3wna' } })
  @ValidateNested({ each: true })
  @Type(() => any)
  public readonly customVars: any = {};

  constructor(id: Types.ObjectId, customVars: any) {
    this.id = id;
    this.customVars = customVars || {};
  }
}
