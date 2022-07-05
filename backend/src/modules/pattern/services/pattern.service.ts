import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePatternDto, UpdatePatternDto } from '../dto';
import { PatternDto } from '../dto/pattern.dto';
import { PatternEntity, PatternEntityWithId } from '../pattern.entity';

@Injectable()
export class PatternService {
  constructor(
    @InjectModel(PatternEntity.name) private readonly patternRepository: Model<PatternEntity>,
  ) {}

  public async createPattern(createPatternDto: CreatePatternDto): Promise<PatternEntityWithId> {
    return new this.patternRepository(createPatternDto).save();
  }

  public async  clone(pattern: PatternEntityWithId) {
    return this.createPattern({
      name: pattern.name,
      script: pattern.script,
      type: pattern.type,
      frameworkId: new Types.ObjectId(pattern.frameworkId._id),
      date: pattern.date
    });
  }

  public async getPatternById(id: Types.ObjectId): Promise<PatternEntityWithId | null> {
    return this.patternRepository.findOne({ _id: id }).exec();
  }

  public async getPatternByName(name: string): Promise<PatternEntityWithId | null> {
    return this.patternRepository.findOne({ name }).exec();
  }

  public bulkInsertPatterns(createPatternDto: CreatePatternDto[]): Promise<PatternEntityWithId[]> {
    return this.patternRepository.insertMany(createPatternDto).catch((err) => {
      throw err;
    });
  }

  public bulkRemovePatterns(field: string, values: string[]) {
    return this.patternRepository.remove({ [field]: { $in: values } });
  }

  public async getPatterns(options = {}): Promise<PatternEntityWithId[]> {
    return this.patternRepository.find(options).limit(50);
  }

  public async mapEntityToDto(patternEntity: PatternEntityWithId) : Promise<PatternDto> {
    return {
      _id: patternEntity?._id?.toString() || '',
      date: patternEntity.date || new Date(Date.now()),
      type: patternEntity.type || '',
      framework: patternEntity.frameworkId?._id?.toString() || '',
      name: patternEntity.name || '',
      script: patternEntity.script || ''
    }
  };

  public async mapEntitysToDtos(patternEntitys: PatternEntityWithId[]) : Promise<PatternDto[]> {
    let result = [];

    for(let i = 0; i < patternEntitys.length; ++i) {
      result.push(await this.mapEntityToDto(patternEntitys[i]));
    }

    return result;
  };

  public removePattern(field: string, value: string) {
    return this.patternRepository
      .find({ [field]: value })
      .remove()
      .exec();
  }

  public async updatePatternById(
    id: Types.ObjectId,
    payload: UpdatePatternDto,
  ): Promise<PatternEntityWithId> {
    let updatedPattern = payload;
    if(updatedPattern) {
      updatedPattern = { ...updatedPattern,frameworkId: new Types.ObjectId(updatedPattern.frameworkId._id) };
    }
    return this.patternRepository.findByIdAndUpdate(id, updatedPattern, { new: true }).exec();
  }

  public async deletePatternById(id: Types.ObjectId): Promise<PatternEntityWithId> {
    return this.patternRepository.findByIdAndRemove(id).exec();
  }
}
