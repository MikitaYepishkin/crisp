import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/common/enums';
import { createError } from 'src/common/helpers';
import { CreatePageDto, UpdatePageDto } from '../dto';
import { PageDto } from '../dto/page.dto';
import { PageEntity, PageEntityWithId } from '../page.entity';

@Injectable()
export class PageService {
  constructor(@InjectModel(PageEntity.name) private readonly pageRepository: Model<PageEntity>) {}

  public async createPage(createPageDto: CreatePageDto): Promise<PageEntityWithId> {
    const { __v, ...newPage } = new this.pageRepository(createPageDto).save();

    return newPage;
  }

  public async clone(page: PageEntityWithId) {
    return this.createPage({
      description: page.description,
      name: page.name,
      projectId: new Types.ObjectId(page.projectId._id),
      date: page.date,
    });
  }

  public bulkInsertPages(createPageDto: CreatePageDto[]): Promise<PageEntityWithId[]> {
    const insertedData: any = this.pageRepository.insertMany(createPageDto).catch((err) => {
      throw err;
    });
    return insertedData;
  }

  public bulkRemovePages(field: string, values: string[]) {
    return this.pageRepository.remove({ [field]: { $in: values } });
  }

  public async getPages(options = {}): Promise<PageEntityWithId[]> {
    return this.pageRepository.find(options);
  }

  public async mapEntityToDto(pageEntity: PageEntityWithId): Promise<PageDto> {
    return {
      _id: pageEntity?._id?.toString() || '',
      date: pageEntity.date,
      name: pageEntity.name || '',
      projectId: pageEntity.projectId?._id?.toString() || '',
      description: pageEntity.description || '',
    };
  }

  public async mapEntitysToDtos(pageEntitys: PageEntityWithId[]): Promise<PageDto[]> {
    const result = [];

    for (let i = 0; i < pageEntitys.length; ++i) {
      result.push(await this.mapEntityToDto(pageEntitys[i]));
    }

    return result;
  }

  public removePage(field: string, value: string) {
    return this.pageRepository
      .find({ [field]: value })
      .remove()
      .exec();
  }

  public async updatePageById(
    id: Types.ObjectId,
    payload: UpdatePageDto,
  ): Promise<PageEntityWithId> {
    let incomeUpdatedPage = payload;
    if (incomeUpdatedPage.projectId) {
      incomeUpdatedPage = { ...incomeUpdatedPage, projectId: new Types.ObjectId(incomeUpdatedPage.projectId._id) };
    }
    const { __v, ...updatedPage } = this.pageRepository.findByIdAndUpdate(id, incomeUpdatedPage, { new: true }).exec();

    return updatedPage;
  }

  public async deletePageById(id: Types.ObjectId): Promise<PageEntityWithId> {
    return this.pageRepository.findByIdAndRemove(id).exec();
  }

  public async getPageBy(options: any): Promise<PageEntityWithId | null> {
    const page: PageEntityWithId = await this.pageRepository.findOne(options).exec();
    if (!page) {
      throw new NotFoundException(createError(ErrorTypeEnum.PAGE_NOT_FOUND, options));
    }
    return page;
  }

  public async getPageById(id: Types.ObjectId): Promise<PageEntityWithId | null> {
    return this.getPageBy({ _id: id });
  }

  public async getPageByName(name: string): Promise<PageEntityWithId | null> {
    return this.getPageBy({ name });
  }
}
