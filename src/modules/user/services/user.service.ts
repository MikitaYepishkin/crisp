import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserEntity, UserEntityWithId } from '../user.entity';
import { createError } from '../../../common/helpers/error-handling.helpers';
import { ErrorTypeEnum } from '../../../common/enums';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { RoleEntity } from '../../../modules/role/role.entity';
import { BcryptHashService } from '../../../common/services/bcrypt-hash.service';

/* import { MailerService } from '@nestjs-modules/mailer'; */

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private readonly userRepository: Model<UserEntity>,
    private readonly bcryptHashService: BcryptHashService,
    /* private readonly mailerService?: MailerService, */
  ) {}

  public async getUserByRefreshToken(
    currentHashedRefreshToken: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({ currentHashedRefreshToken }).exec();
  }

  /*
  public async sendMailForUser(email: string): Promise<void> {
    const resp = await this.mailerService.sendMail({
      to: email, 
      from: 'crisp.mail.notification@gmail.com',
      subject: 'Message from Crisp', 
      text: 'This message was sent from Node js server.', 
      html: 'This <i>message</i> was sent from <strong>Node js</strong> server.', 
    });

    if (resp) {
      console.log('---- send mail successful -----');
    } else {
      console.log('---- send mail error -----');
    }

    console.log('---- send mail ended -----');
  }
  */

  public async getUserEntityByEmail(email: string): Promise<UserEntityWithId | null> {
    return this.userRepository
      .findOne({ email })
      .populate({
        path: 'roles',
        model: RoleEntity.name,
      })
      .exec();
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserEntityWithId> {
    const createUser: CreateUserDto = {
      ...createUserDto,
      password: await this.bcryptHashService.hashPassword(createUserDto.password),
      roles: createUserDto.roles.map((roleId: any) => {
        return new Types.ObjectId();
      }),
    };
    // await this.sendMailForUser(createUser.email);
    return new this.userRepository(createUser).save();
  }

  public async getUsers(options = {}): Promise<UserEntity[]> {
    return this.userRepository
      .find(options)
      .populate({
        path: 'roles',
        model: RoleEntity.name,
      })
      .exec();
  }

  public async updateUserById(
    id: Types.ObjectId,
    payload: UpdateUserDto,
  ): Promise<UserEntityWithId> {
    return this.userRepository.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  public async deleteUserById(id: Types.ObjectId): Promise<UserEntityWithId> {
    return this.userRepository.findByIdAndRemove(id).exec();
  }

  public async getUserBy(options: any): Promise<UserEntityWithId | null> {
    const user: UserEntityWithId = await this.userRepository.findOne(options).exec();
    if (!user) {
      throw new NotFoundException(createError(ErrorTypeEnum.USER_NOT_FOUND, options));
    }
    return user;
  }

  public async getUserByEmail(email: string): Promise<UserEntityWithId | null> {
    return this.getUserBy({ email });
  }

  public async getUserById(id: Types.ObjectId): Promise<UserEntityWithId | null> {
    return this.getUserBy({ _id: id });
  }

  public async removeRefreshToken(id: Types.ObjectId): Promise<UserEntityWithId> {
    return this.updateUserById(id, { currentHashedRefreshToken: null, date: new Date(Date.now()) });
  }

  public async setCurrentRefreshTokenAndGetUser(
    id: Types.ObjectId,
    refreshToken: string,
  ): Promise<UserEntityWithId> {
    console.log('--------------- 999 ----------');
    await this.updateUserById(id, {
      currentHashedRefreshToken: refreshToken,
      date: new Date(Date.now()),
    });
    return this.getUserById(id);
  }

  public async getUserIfRefreshTokenMatches(
    currentHashedRefreshToken: string,
  ): Promise<UserEntityWithId> {
    return this.getUserBy({ currentHashedRefreshToken });
  }

  public bulkInsertUsers(createUserDto: CreateUserDto[]): Promise<UserEntityWithId[]> {
    const insertedData: any = this.userRepository.insertMany(createUserDto).catch((err) => {
      throw err;
    });
    return insertedData;
  }
}
