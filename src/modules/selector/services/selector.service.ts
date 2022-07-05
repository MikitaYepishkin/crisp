import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorTypeEnum } from '../../../common/enums';
import { createError } from '../../../common/helpers';
import { CreateSelectorDto, UpdateSelectorDto } from '../dto';
import { SelectorDto } from '../dto/selector.dto';
import { SelectorEntity, SelectorEntityWithId } from '../selector.entity';

@Injectable()
export class SelectorService {
  constructor(
    @InjectModel(SelectorEntity.name) private readonly selectorRepository: Model<SelectorEntity>,
  ) {}

  public async createSelector(createSelectorDto: CreateSelectorDto): Promise<SelectorEntityWithId> {
    return new this.selectorRepository(createSelectorDto).save();
  }

  public async  clone(selector: SelectorEntityWithId) {
    return this.createSelector({
      elementCss: selector.elementCss,
      elementId: selector.elementId,
      elementXPath: selector.elementXPath
    });
  }

  public bulkInsertSelectors(
    createSelectorDto: CreateSelectorDto[],
  ): Promise<SelectorEntityWithId[]> {
    return this.selectorRepository.insertMany(createSelectorDto).catch((err) => {
      throw err;
    });
  }

  public bulkRemoveSelectors(field: string, values: string[]) {
    return this.selectorRepository.remove({ [field]: { $in: values } });
  }

  public async getSelectors(options = {}): Promise<SelectorEntity[]> {
    return this.selectorRepository.find(options);
  }

  public async mapEntityToDto(selectorEntity: SelectorEntityWithId) : Promise<SelectorDto> {
    return {
      _id: selectorEntity._id.toString() || '',
      elementId: selectorEntity.elementId || '',
      elementCss: selectorEntity.elementCss || '',
      elementXPath: selectorEntity.elementXPath || ''
    }
  };

  public async mapEntitysToDtos(selectorEntitys: SelectorEntityWithId[]) : Promise<SelectorDto[]> {
    const result = [];

    for(let i = 0; i < selectorEntitys.length; ++i) {
      result.push(await this.mapEntityToDto(selectorEntitys[i]));
    }

    return result;
  };

  public removeSelector(field: string, value: string) {
    return this.selectorRepository
      .find({ [field]: value })
      .remove()
      .exec();
  }

  public async updateSelectorById(
    id: Types.ObjectId,
    payload: UpdateSelectorDto,
  ): Promise<SelectorEntityWithId> {
    return this.selectorRepository.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  public async deleteSelectorById(id: Types.ObjectId): Promise<SelectorEntityWithId> {
    return this.selectorRepository.findByIdAndRemove(id).exec();
  }

  public async getSelectorBy(options: any): Promise<SelectorEntityWithId | null> {
    console.log('--------------- 6.6.2 ----------');
    console.log(options);
    const selector: SelectorEntityWithId = await this.selectorRepository.findOne(options).exec();
    console.log(selector);
    if (!selector) {
      console.log('--------------- 6.6.2.1 ----------');
      throw new NotFoundException(createError(ErrorTypeEnum.SELECTOR_NOT_FOUND, options));
    }
    console.log('--------------- 6.6.3 ----------');
    return selector;
  }

  public async getSelectorById(id: Types.ObjectId): Promise<SelectorEntityWithId | null> {
    console.log('--------------- 6.6.1 ----------');
    return this.getSelectorBy({ _id: id });
  }
}
