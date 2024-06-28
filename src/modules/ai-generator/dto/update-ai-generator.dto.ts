import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AIGeneratorPromtDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    public readonly chatgptOrganizationId?: string;

    @IsString()
    @ApiProperty()
    public readonly chatgptKey: string = '';

    @IsString()
    @ApiProperty()
    public readonly chatgptPromt: string = '';

    @IsString()
    @IsOptional()
    @ApiProperty()
    public readonly chatgptModelVersion: string = '';
  }
