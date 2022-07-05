import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ElementEntity, ElementEntityWithId } from '../element/element.entity';

@Schema()
export class SelectorEntity {
  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String })
  public elementId?: string;

  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String })
  public elementCss?: string;

  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String })
  public elementXPath?: string;
}

export interface SelectorEntityWithId extends SelectorEntity {
  readonly _id: Types.ObjectId;
}

export const SelectorSchema = SchemaFactory.createForClass(SelectorEntity);

export const SelectorModel = mongoose.model(SelectorEntity.name, SelectorSchema);
