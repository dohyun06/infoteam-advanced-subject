import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(uuid: string): Promise<UserDto> {
    return await this.prisma.user
      .findUnique({ where: { uuid: uuid } })
      .then((user) => {
        if (!user) throw new NotFoundException('User uuid is not found');
        return user;
      });
  }

  async deleteUser(uuid: string) {
    return await this.prisma.user
      .delete({
        where: { uuid: uuid },
      })
      .catch((err) => {
        if (err === PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('User uuid is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async subscribeCategory(uuid: string, category: string) {
    return await this.prisma.user
      .update({
        where: { uuid: uuid },
        data: {
          subcriptions: { connect: { name: category } },
        },
        include: {
          subcriptions: true,
        },
      })
      .catch((err) => {
        if (err === PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('User uuid is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }
}
