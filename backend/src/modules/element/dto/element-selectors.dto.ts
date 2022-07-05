import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { setValidationMessage } from 'src/common/helpers';

export class ElementSelectorsDto {
  @IsString()
  @MinLength(0, {
    message: setValidationMessage('ElementCss should be more than'),
  })
  @MaxLength(50, {
    message: setValidationMessage('ElementCss should be less than'),
  })
  @ApiProperty({ example: 'searchInput' })
  public readonly elementId?: string;

  @IsString()
  @MinLength(0, {
    message: setValidationMessage('ElementCss should be more than'),
  })
  @MaxLength(50, {
    message: setValidationMessage('ElementCss should be less than'),
  })
  @IsOptional()
  @ApiProperty({ example: '#searchInput' })
  public readonly elementCss?: string;

  @IsString()
  @MinLength(0, {
    message: setValidationMessage('ElementXPath should be more than'),
  })
  @MaxLength(50, {
    message: setValidationMessage('ElementXPath should be less than'),
  })
  @IsOptional()
  @ApiProperty({ example: '//*[@id=searchInput]' })
  public readonly elementXPath?: string;

  constructor(elementId: string, elementCss: string, elementXPath: string) {
    this.elementId = elementId;
    this.elementCss = elementCss;
    this.elementXPath = elementXPath;
  }
}
