import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { FrameworkEntity, FrameworkEntityWithId } from '../framework/framework.entity';

@Schema()
export class PatternEntity {
  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String, required: true })
  public type: string;

  @ApiProperty({
    type: Types.ObjectId,
    description: 'Framework Mongo Id',
  })
  @Prop({ type: Types.ObjectId, ref: FrameworkEntity.name })
  public frameworkId: FrameworkEntityWithId;

  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String, required: true })
  public name: string;

  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String, required: true })
  public script: string;

  @ApiProperty()
  @Prop({
    type: Types.Date,
    required: false,
    description: 'Project Date Mongo Id',
  })
  public date: Date = new Date(Date.now());
}

export interface PatternEntityWithId extends PatternEntity {
  readonly _id: Types.ObjectId;
}

export const PatternSchema = SchemaFactory.createForClass(PatternEntity);

export const PatternModel = mongoose.model(PatternEntity.name, PatternSchema);
