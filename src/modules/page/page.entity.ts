import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IsOptional } from 'class-validator';
import { ProjectEntity, ProjectEntityWithId } from '../project/project.entity';

@Schema()
export class PageEntity {
  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String, required: true })
  @IsOptional()
  public description?: string;

  @ApiProperty({
    type: Types.ObjectId,
    description: 'Project Mongo Id',
  })
  @Prop({ type: Types.ObjectId, ref: ProjectEntity.name })
  public projectId: ProjectEntityWithId;

  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String, required: true })
  public name: string;

  @ApiProperty()
  @Prop({
    type: Date,
    required: false,
    description: 'Project Date Mongo Id',
  })
  public date: Date = new Date(Date.now());
}

export interface PageEntityWithId extends PageEntity {
  readonly _id: Types.ObjectId;
}

export const PageSchema = SchemaFactory.createForClass(PageEntity);

export const PageModel = mongoose.model(PageEntity.name, PageSchema);
