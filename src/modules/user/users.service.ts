import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { WatchList } from '../watchlist/models/watchList.model';
//import { users } from 'src/moks';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepositiriy: typeof User,
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
      return this.userRepositiriy.findOne({
        where: { email: email },
        include: { model: WatchList, required: false },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      dto.password = await this.hashPassword(dto.password);
      await this.userRepositiriy.create({
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

  async publicUser(email: string): Promise<User> {
    try {
      return this.userRepositiriy.findOne({
        where: { email },
        attributes: { exclude: ['password'] },
        include: {
          model: WatchList,
          required: false,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      await this.userRepositiriy.update(dto, { where: { email } });
      return dto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      await this.userRepositiriy.destroy({ where: { email } });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  /*   getUsers() {
    return users;
  } */
}
