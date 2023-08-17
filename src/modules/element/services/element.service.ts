import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/common/enums';
import { createError } from 'src/common/helpers';
import { PatternDataEntity } from 'src/modules/pattern/pattern-data.entity ';
import { PatternDataService } from '../../../modules/pattern';
import { SelectorService } from '../../../modules/selector';
import { CreateElementDto, UpdateElementDto } from '../dto';
import { ElementDto } from '../dto/element.dto';
import { ElementEntity, ElementEntityWithId } from '../element.entity';

@Injectable()
export class ElementService {
  constructor(
    @InjectModel(ElementEntity.name) private readonly elementRepository: Model<ElementEntity>,
    private readonly selectorService: SelectorService,
    private readonly patternDataService: PatternDataService,
  ) {}

  public async createElement(createElementDto: CreateElementDto): Promise<ElementEntityWithId> {
    const newSelectors = createElementDto.selectors && await this.selectorService.createSelector(createElementDto.selectors);
    const selectors = newSelectors && newSelectors._id;
    /*
    const setObjectPatternData = async (params) => {
      if (!params.pageObjectPattern) return params.pageObjectPattern;
      const pageObjectPattern = await this.patternDataService.createPatternData(
        params.pageObjectPattern,
      );
      return pageObjectPattern._id;
    };
    */

    const setActionPatternData = async (params) => {
      if (!params.actionPatterns.length) return params.actionPatterns;
      const pageActionPatterns = await Promise.all(
        params.actionPatterns.map(
          this.patternDataService.createPatternData.bind(this.patternDataService),
        ),
      );
      return pageActionPatterns; // .map((pattern: any) => pattern._id);
    };

    const pageObjectPatternId = createElementDto.pageObjectPattern? new Types.ObjectId(createElementDto.pageObjectPattern) : null; // await setObjectPatternData(createElementDto);
    const actionPatterns = createElementDto.actionPatterns;

    let { name, description, pageId, parentElementId } = createElementDto;

    parentElementId = typeof parentElementId === 'string' ? new Types.ObjectId(parentElementId) : parentElementId;
    //  ? new Types.ObjectId(parentElementId)
    //  : parentElementId;
    pageId = typeof pageId === 'string' ? new Types.ObjectId(pageId) : pageId;

    const newEl =  new this.elementRepository({
      name,
      description,
      pageId,
      parentElementId,
      actionPatterns,
      pageObjectPatternId,
      selectors
    }).save();

    return newEl;
  }

  public async asyncMapClone(datas: any, servive: any, transformFunc: any) {
    const list = [];

    for (let i = 0; i < datas.length; ++i) {
      const data = datas[i];
      list.push(await servive.clone(await transformFunc(data)));
    }

    return list;
  }

  public async clone(element: ElementEntityWithId) {
    console.log('--------------- 6.6 ----------');
    console.log(element);
    console.log(element.selectors);
    let selector: any;

    const actionPatDs = element.actionPatterns || [];

    try {
      console.log('--------------- 6.7 ----------');
      selector = element.selectors
        ? await this.selectorService.getSelectorById(element.selectors)
        : await this.selectorService.getSelectorBy({
            elementId: element._id,
          });

      console.log('--------------- 6.7.2 ----------');
      return this.createElement({
        name: element.name,
        description: element.description,
        pageId: element.pageId._id,
        selectors: {
          elementId: selector.elementId?._id || null,
          elementCss: selector.elementCss,
          elementXPath: selector.elementXPath,
        },
        pageObjectPattern: element.pageObjectPatternId ? element.pageObjectPatternId : null,
        actionPatterns: [...actionPatDs],
        parentElementId: element.parentElementId._id,
        date: element.date,
      });
    } catch (e) {
      console.log('--------------- 6.8 ----------');
      return this.createElement({
        name: element.name,
        description: element.description,
        pageId: element.pageId._id,
        selectors: null,
        pageObjectPattern: element.pageObjectPatternId ? element.pageObjectPatternId : null,
        actionPatterns: actionPatDs,
        parentElementId: element.parentElementId._id,
        date: element.date,
      });
    }
  }

  public async bulkInsertElements(
    createElementDto: CreateElementDto[],
  ): Promise<ElementEntityWithId[]> {
    const insertedData: any = this.elementRepository.insertMany(createElementDto).catch((err) => {
      throw err;
    });
    return insertedData;
  }

  public bulkRemoveElements(field: string, values: string[]) {
    return this.elementRepository.remove({ [field]: { $in: values } });
  }

  public async getElements(options = {}): Promise<ElementEntityWithId[]> {
    const elements = await this.elementRepository.find(options);

      console.log(elements);

    return elements;
  }

  public async mapEntityToDto(elementEntity: ElementEntityWithId): Promise<ElementDto> {
    console.log(`------- mapEntityToDto Elements ----------`);
    console.log(elementEntity);
    const actionPatterns = elementEntity.actionPatterns || [];

    const result = {
      _id: elementEntity?._id?.toString() || '',
      date: elementEntity.date || new Date(Date.now()),
      name: elementEntity.name || '',
      description: elementEntity.description || '',
      page: elementEntity.pageId?._id?.toString() || '',
      selectors: elementEntity.selectors
        ? await this.selectorService.getSelectorById(elementEntity.selectors)
        : {},
      pageObjectPattern: elementEntity?.pageObjectPatternId?.toString() || null,
      actionPatterns: actionPatterns,
      parentElement: elementEntity?.parentElementId?._id?.toString() || '',
    };

    console.log(`------- mapEntityToDto Elements Result ----------`);
    console.log(result);
    return result;
  }

  public async mapEntitysToDtos(elementEntitys: ElementEntityWithId[]): Promise<ElementDto[]> {
    const result = [];

    for (let i = 0; i < elementEntitys.length; ++i) {
      try {
        const element = await this.mapEntityToDto(elementEntitys[i]);
        result.push(element);
      } catch(e: any) {
        console.log('Error elementEntitys');
      }
    }

    return result;
  }

  public removeElement(field: string, value: string) {
    return this.elementRepository
      .find({ [field]: value })
      .remove()
      .exec();
  }

  public async updateElementById(
    id: Types.ObjectId,
    payload: UpdateElementDto,
  ): Promise<ElementEntityWithId> {
    let updatedPayload: any = payload;
    if (updatedPayload.parentElementId) {
      updatedPayload.parentElementId = new Types.ObjectId(updatedPayload.parentElementId);
    }
    if (updatedPayload.pageId) {
      updatedPayload.pageId = new Types.ObjectId(updatedPayload.pageId);
    }
    return this.elementRepository.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  public async deleteElementById(id: Types.ObjectId): Promise<ElementEntityWithId> {
    return this.elementRepository.findByIdAndRemove(id).exec();
  }

  public async getElementBy(options: any): Promise<ElementEntityWithId | null> {
    const element: ElementEntityWithId = await this.elementRepository.findOne(options).exec();
    if (!element) {
      throw new NotFoundException(createError(ErrorTypeEnum.ELEMENT_NOT_FOUND, options));
    }
    return element;
  }

  public async getElementById(id: Types.ObjectId): Promise<ElementEntityWithId | null> {
    return this.getElementBy({ _id: id });
  }
}
