import {
  Injectable,
  Logger,
  ConflictException,
  Inject,
  forwardRef,
  ImATeapotException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user';
import { ConfigService } from 'src/config';
import { RegisterDto, LoginDto, LogoutDto } from '../dto';
import {
  ResponseSuccess,
  RefreshAccessTokenResponse,
  LoginResponse,
  LogoutResponse,
} from '../auth.interface';
import { createError } from '../../../common/helpers/error-handling.helpers';
import { ErrorTypeEnum, RoleTypeEnum } from '../../../common/enums';
import { BcryptHashService } from '../../../common/services/bcrypt-hash.service';
import { TokenPayload } from '../token-payload.interface';
import { UserEntityWithId } from 'src/modules/user/user.entity';
import { Types } from 'mongoose';
import { RoleService } from 'src/modules/role';
import { secondsToHours } from 'src/common/helpers';
import { FrameworkService } from 'src/modules/framework';
import { PageService } from 'src/modules/page';
import { PatternService } from 'src/modules/pattern';
import { ProjectService } from 'src/modules/project';
import { ElementService } from 'src/modules/element';
import { ProjectEntityWithId } from 'src/modules/project/project.entity';

export interface initProjectData {
  patterns: any[];
  pages: any[];
  elements: any[];
  framework: any[];
  projects: any[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptHashService: BcryptHashService,
    private readonly roleService: RoleService,

    private readonly frameworkService: FrameworkService,
    private readonly pageService: PageService,
    private readonly patternService: PatternService,
    private readonly projectService: ProjectService,
    private readonly elementService: ElementService,
  ) {}

  public async register(credentials: RegisterDto): Promise<ResponseSuccess> {
    if (await this.userService.getUserEntityByEmail(credentials.email)) {
      throw new ConflictException(createError(ErrorTypeEnum.EMAIL_ALREADY_TAKEN, 'email'));
    }
    const hashedPassword = await this.bcryptHashService.hashPassword(credentials.password);
    const userRole = await this.roleService.getRoleByName(RoleTypeEnum.USER);

    const user = await this.userService.createUser({
      ...credentials,
      password: hashedPassword,
      date: new Date(Date.now()),
      roles: [userRole._id],
    });
    const accessToken: string = await this.getAndGenerateJwtAccessToken(user._id);
    const refreshToken: string = await this.getAndGenerateJwtRefreshToken(user.email);
    await this.userService.setCurrentRefreshTokenAndGetUser(user._id, refreshToken);
    const expiresIn: number = secondsToHours(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );
    return { accessToken, refreshToken, expiresIn: `${expiresIn}h` };
  }

  public async generateProjectData(
    projectIds: ProjectEntityWithId[],
    isAdmin = false,
  ): Promise<initProjectData> {
    console.log('--------------- VVVV ----- 1 -----');
    const projectsEntity = isAdmin
      ? await this.projectService.getProjects()
      : await this.projectService.getProjects({
          _id: { $in: projectIds },
        });
    const projects = await this.projectService.mapEntitysToDtos(projectsEntity);
    //---------------------------------------------------------------------------

    console.log('--------------- VVVV ----- 2 -----');
    const frameworksIds = projectsEntity.map((pr) => pr.frameworkId);
    const frameworksEntity = await this.frameworkService.getFrameworks({
      _id: { $in: frameworksIds },
    });
    const frameworks = await this.frameworkService.mapEntitysToDtos(frameworksEntity);
    //---------------------------------------------------------------------------

    console.log('--------------- VVVV ----- 3 -----');
    const pagesEntity = await this.pageService.getPages({
      projectId: { $in: projectsEntity.map((p) => p._id) },
    });
    const pageIds = pagesEntity.map((pg) => pg._id);
    const pages = await this.pageService.mapEntitysToDtos(pagesEntity);
    //---------------------------------------------------------------------------

    console.log(`--------------- VVVV ----- 4----- ${frameworksIds}`);
    const patternsEntity = await this.patternService.getPatterns({
      frameworkId: { $in: frameworksIds },
    });
    console.log('--------------- VVVV ----- 4_1-----');
    const patterns = await this.patternService.mapEntitysToDtos(patternsEntity);
    //---------------------------------------------------------------------------

    console.log('--------------- VVVV ----- 5-----');
    const elementsEntity = await this.elementService.getElements(
      {
        pageId: { $in: pageIds },
      },
      true,
    );
    const elements = await this.elementService.mapEntitysToDtos(elementsEntity);
    //---------------------------------------------------------------------------
    console.log('--------------- VVVV ----- 6-----');
    return {
      patterns: patterns,
      pages: pages,
      elements: elements,
      framework: frameworks,
      projects: projects,
    };
  }

  public async login(credentials: LoginDto): Promise<LoginResponse> {
    const user: UserEntityWithId = await this.userService.getUserEntityByEmail(credentials.email);
    if (!user) {
      throw new ConflictException(createError(ErrorTypeEnum.EMAIL_DOES_NOT_EXISTS, 'email'));
    }
    if (!(await this.bcryptHashService.compareUserPassword(credentials.password, user.password))) {
      throw new ConflictException(createError(ErrorTypeEnum.PASSWORD_IS_NOT_CORRECT, 'password'));
    }
    const accessToken: string = await this.getAndGenerateJwtAccessToken(user._id);
    const refreshToken: string = await this.getAndGenerateJwtRefreshToken(user.email);
    await this.userService.setCurrentRefreshTokenAndGetUser(user._id, refreshToken);
    const expiresIn: number = secondsToHours(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );
    console.log('--------------- VVVV ----------');
    const gerMainRole = (roles: any = []) =>
      roles.find((role: any) => role.name === 'ADMIN') || (roles.length && roles[0]);
    const role = gerMainRole(user.roles);
    const projectInitData = await this.generateProjectData(user.projects, role.name === 'ADMIN');
    console.log('--------------- ZZZZ ----------');
    return {
      accessToken,
      refreshToken,
      expiresIn: `${expiresIn}h`,
      user: user,
      projectInitData: projectInitData,
    };
  }

  public async logout(credentials: LogoutDto): Promise<LogoutResponse> {
    const user: UserEntityWithId = await this.userService.getUserIfRefreshTokenMatches(
      credentials.refreshToken,
    );
    await this.userService.removeRefreshToken(user._id);
    return { userId: user._id.toString() };
  }

  public async getAndGenerateJwtAccessToken(userId: Types.ObjectId): Promise<string> {
    const user: UserEntityWithId = await this.userService.getUserById(userId);
    const payload: TokenPayload = { email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  public async getAndGenerateJwtRefreshToken(email: string): Promise<string> {
    const payload: TokenPayload = { email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
  }

  public async refreshAccessToken(refreshToken: string): Promise<RefreshAccessTokenResponse> {
    const user: UserEntityWithId = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
    );
    try {
      await this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (err) {
      throw new ConflictException(createError(ErrorTypeEnum.INVALID_REFRESH_TOKEN, 'refreshToken'));
    }
    return { accessToken: await this.getAndGenerateJwtAccessToken(user._id) };
  }
}
