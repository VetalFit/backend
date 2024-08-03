import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserDTO } from './dto';
import { WatchList } from '../watchlist/models/watchList.model';
import { TokenService } from '../token/token.service';
import { AuthUserResponse } from '../auth/response';
import { AppError } from 'src/common/constants/errors';
//import { users } from 'src/moks';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly tokenService: TokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (e) {
      throw new Error(e);
    }
  }

  async finUserByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { email },
        include: { model: WatchList, required: false },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findUSerById(id: number): Promise<User> {
    try {
      return this.userRepository.findOne({
        where: { id },
        include: { model: WatchList, required: false },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      dto.password = await this.hashPassword(dto.password);
      await this.userRepository.create({
        firstName: dto.firstName,
        userName: dto.userName,
        email: dto.email,
        password: dto.password,
      });
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async publicUser(email: string): Promise<AuthUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        attributes: { exclude: ['password'] },
        include: {
          model: WatchList,
          required: false,
        },
      });
      const token = await this.tokenService.genereateJwtToken(user);
      return { user, token };
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(userId: number, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      await this.userRepository.update(dto, { where: { id: userId } });
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updatePassword(userId: number, dto: UpdatePasswordDTO): Promise<any> {
    try {
      const { password } = await this.findUSerById(userId);
      const currentPassword = await bcrypt.compare(dto.oldPassword, password);
      if (!currentPassword) return new BadRequestException(AppError.WRONG_DATA);
      const newPassword = await this.hashPassword(dto.newPassword);
      const data = {
        password: newPassword,
      };
      return this.userRepository.update(data, { where: { id: userId } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.userRepository.destroy({ where: { email } });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  /*   getUsers() {
    return users;
  } */
}
