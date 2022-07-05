import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { createError } from '../../../common/helpers';
import { PatternService } from '.';
import { CreatePatternDataDto } from '../dto';
import { PatternDataEntity, PatternDataEntityWithId } from '../pattern-data.entity ';
import { ErrorTypeEnum } from 'src/common/enums';
import { PatternDataDto } from '../dto/pattern-data.dto';
import { types } from 'util';

@Injectable()
export class PatternDataService {
  constructor(
    @InjectModel(PatternDataEntity.name)
    private readonly patternDataRepository: Model<PatternDataEntity>,
    private readonly patternService: PatternService,
  ) {}

  public async createPatternData(
    createPatternDataDto: CreatePatternDataDto,
  ): Promise<PatternDataEntityWithId> {
    if (!(await this.patternService.getPatternById(createPatternDataDto.id))) {
      throw new NotFoundException(
        createError(ErrorTypeEnum.PATTERN_NOT_FOUND, String(createPatternDataDto.id)),
      );
    }
    return new this.patternDataRepository({ ...createPatternDataDto, id: new Types.ObjectId(createPatternDataDto.id)  }).save();
  }

  public async asyncMapClone(datas: any, servive: any, transformFunc: any) {
    const list = [];
    
    for(let i = 0; i< datas.length; ++i){
      const data = datas[i];
      list.push(await servive.clone(await transformFunc(data)));
    }

    return list;
  }

  public async  clone(patternData: PatternDataEntityWithId) {
    //--------------------------------

    const patternsEntity = await this.patternService.getPatternById(patternData.id);

    console.log('--------------- 6.2 ----------');
    const pattern = await this.patternService.clone(patternsEntity);

    //----------------------------------------

    return this.createPatternData({
      id: pattern ? pattern._id : null,
      customVars: patternData.customVars,
      date: new Date(Date.now())
    });
  }

  public async getPatterns(options = {}): Promise<PatternDataEntityWithId[]> {
    return this.patternDataRepository.find(options);
  }

  public async mapEntityToDto(patternDataEntity: PatternDataEntityWithId) : Promise<PatternDataDto> {
    return {
      _id: patternDataEntity?._id?.toString() || '',
      id: patternDataEntity?.id?.toString() || '',
      customVars: patternDataEntity.customVars,
      date: new Date(Date.now())
    }
  };

  public async mapEntitysToDtos(patternDataEntitys: PatternDataEntityWithId[]) : Promise<PatternDataDto[]> {
    const result = [];

    for(let i = 0; i < patternDataEntitys.length; ++i) {
      result.push(await this.mapEntityToDto(patternDataEntitys[i]));
    }

    return result;
  };
}
