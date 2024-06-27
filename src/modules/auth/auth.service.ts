import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { CreateUserDTO } from '../user/dto';
import { AppError } from 'src/common/constants/errors';
import { UserLoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
// import { authUserResponse } from './response';
import { AuthUserResponse } from './response';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  async registerUser(dto: CreateUserDTO): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.finUserByEmail(dto.email);
      if (existUser) throw new BadRequestException(AppError.USER_EXIST);
      await this.userService.createUser(dto);
      return this.userService.publicUser(dto.email);
    } catch (e) {
      throw e;
    }
  }

  async loginUser(dto: UserLoginDTO): Promise<AuthUserResponse> {
    try {
      const existUser = await this.userService.finUserByEmail(dto.email);
      if (!existUser) throw new BadRequestException(AppError.USER_NOT_EXIST);
      const validatePassword = await bcrypt.compare(
        dto.password,
        existUser.password,
      );
      if (!validatePassword) throw new BadRequestException(AppError.WRONG_DATA);
      return this.userService.publicUser(dto.email);
    } catch (e) {
      throw new Error(e);
    }
  }
}
