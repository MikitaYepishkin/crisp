import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorTypeEnum } from 'src/common/enums';
import { createError } from 'src/common/helpers';
import { FrameworkEntity } from 'src/modules/framework/framework.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dto';
import { ProjectDto } from '../dto/project.dto';
import { ProjectEntity, ProjectEntityWithId } from '../project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectEntity.name) private readonly projectRepository: Model<ProjectEntity>,
  ) {}

  public async createProject(createProjectDto: CreateProjectDto): Promise<ProjectEntityWithId> {
    return new this.projectRepository({...createProjectDto, frameworkId: new Types.ObjectId(createProjectDto.frameworkId) }).save();
  }

  public async  clone(project: ProjectEntityWithId) {
    return this.createProject({
      name: project.name,
      description: project.description,
      isDefault: project.isDefault,
      frameworkId: project.frameworkId,
      date: new Date(Date.now())
    });
  }


  public bulkInsertProjects(createProjectDto: CreateProjectDto[]): Promise<ProjectEntityWithId[]> {
    return this.projectRepository.insertMany(createProjectDto).catch((err) => {
      throw err;
    });
  }

  public bulkRemoveProjects(field: string, values: string[]) {
    return this.projectRepository.remove({ [field]: { $in: values } });
  }

  public async getProjects(options = {}): Promise<ProjectEntityWithId[]> {
    return this.projectRepository.find(options);
  }

  public async mapEntityToDto(projectEntity: ProjectEntityWithId) : Promise<ProjectDto> {
    console.log(projectEntity);
    return {
      _id: projectEntity._id.toString(),
      date: new Date(Date.now()),
      name: projectEntity.name || '',
      framework: projectEntity.frameworkId.toString() || '',
      description: projectEntity.description || '',
      isDefault: projectEntity.isDefault || false
    }
  };

  public async mapEntitysToDtos(projectEntitys: ProjectEntityWithId[]) : Promise<ProjectDto[]> {
    let result = [];

    for(let i = 0; i < projectEntitys.length; ++i) {
      result.push(await this.mapEntityToDto(projectEntitys[i]));
    }

    return result;
  };

  public removeProject(field: string, value: string) {
    return this.projectRepository
      .find({ [field]: value })
      .remove()
      .exec();
  }

  public async updateProjectById(
    id: Types.ObjectId,
    payload: UpdateProjectDto,
  ): Promise<ProjectEntityWithId> {
    console.log(`Update___`);
    
    let updatedProject = payload;
    console.log(updatedProject);
    if(updatedProject.frameworkId) {
      updatedProject ={ ...updatedProject, frameworkId: new Types.ObjectId(updatedProject.frameworkId) };
    }
    if(updatedProject.isDefault) {
      const projects = await this.getProjects();
      const selt = this;
      for(var i=0; i<projects.length; ++i) {projects
        const _id = projects[i]._id;
        console.log(`__id: ${_id} __id: ${id} ===: ${_id === id}`)
        if(_id !== id) {
          await this.projectRepository.findByIdAndUpdate(_id, {isDefault: false}, { new: true }).exec();
        };
      }
    }
    return this.projectRepository.findByIdAndUpdate(id, updatedProject, { new: true }).exec();
  }

  public async deleteProjectById(id: Types.ObjectId): Promise<ProjectEntityWithId> {
    return this.projectRepository.findByIdAndRemove(id).exec();
  }

  public async getProjectBy(options: any): Promise<ProjectEntityWithId | null> {
    const project: ProjectEntityWithId = await this.projectRepository.findOne(options).exec();
    if (!project) {
      throw new NotFoundException(createError(ErrorTypeEnum.PROJECT_NOT_FOUND, options));
    }
    return project;
  }

  public async getProjectById(id: Types.ObjectId): Promise<ProjectEntityWithId | null> {
    return this.getProjectBy({ _id: id });
  }

  public async getProjectByName(name: string): Promise<ProjectEntityWithId | null> {
    return this.getProjectBy({ name });
  }
}
