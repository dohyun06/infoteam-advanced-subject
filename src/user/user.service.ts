import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string): Promise<UserDto> {
    return await this.prisma.user
      .findUnique({ where: { id: id } })
      .then((user) => {
        if (!user) throw new NotFoundException('User uuid is not found');
        return user;
      });
  }

  async deleteUser(id: string) {
    return await this.prisma.user
      .delete({
        where: { id: id },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('User uuid is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async subscribeCategory({ userInfo }, category: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        sub: userInfo.sub,
      },
      select: {
        id: true,
      },
    });

    if (!user) throw new NotFoundException('User id is not found');

    return await this.prisma.userSubscription
      .create({
        data: {
          user: {
            connect: { id: user.id },
          },
          category: {
            connect: { id: category },
          },
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('User uuid is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async unsubscribeCategory({ userInfo }, category: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        sub: userInfo.sub,
      },
      select: {
        id: true,
      },
    });

    if (!user) throw new NotFoundException('User id is not found');

    return await this.prisma.userSubscription
      .delete({
        where: {
          userId_categoryId: {
            userId: user.id,
            categoryId: category,
          },
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new NotFoundException('User id is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }
}
