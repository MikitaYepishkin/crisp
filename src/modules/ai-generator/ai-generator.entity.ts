import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { PermissionEntity } from '../permission/permission.entity';

@Schema()
export class AIGeneratorEntity {
  @ApiProperty({ maxLength: 50 })
  @Prop({ type: String, required: true })
  public name: string;

  @ApiProperty({
    type: [Types.ObjectId],
    description: 'Permission Mongo Ids',
  })
  @Prop([{ type: Types.ObjectId, ref: PermissionEntity.name }])
  public permissions: PermissionEntity[];
}

export interface AIGeneratorEntityWithId extends AIGeneratorEntity {
  readonly _id: Types.ObjectId;
}

export const AIGeneratorSchema = SchemaFactory.createForClass(AIGeneratorEntity);

export const AIGeneratorModel = mongoose.model(AIGeneratorEntity.name, AIGeneratorSchema);
