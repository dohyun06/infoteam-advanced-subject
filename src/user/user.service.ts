import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(uuid: string): Promise<UserDto> {
    return await this.prisma.user
      .findUnique({ where: { uuid: uuid } })
      .then((user) => {
        if (!user) throw new NotFoundException('ID is not found');
        return user;
      });
  }

  async deleteUser(uuid: string) {
    return await this.prisma.user
      .delete({
        where: { uuid: uuid },
      })
      .catch((err) => {
        throw new InternalServerErrorException();
      });
  }
}
