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

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async finUserByEmail(email: string) {
    return this.userRepositiriy.findOne({
      where: { email: email },
    });
  }

  async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
    dto.password = await this.hashPassword(dto.password);
    await this.userRepositiriy.create({
      firstName: dto.firstName,
      userName: dto.userName,
      email: dto.email,
      password: dto.password,
    });
    return dto;
  }

  async publicUser(email: string) {
    return this.userRepositiriy.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
      include: {
        model: WatchList,
        required: false,
      },
    });
  }

  async updateUser(email: string, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    await this.userRepositiriy.update(dto, { where: { email } });
    return dto;
  }

  async deleteUser(email: string): Promise<boolean> {
    await this.userRepositiriy.destroy({ where: { email } });
    return true;
  }

  /*   getUsers() {
    return users;
  } */
}
