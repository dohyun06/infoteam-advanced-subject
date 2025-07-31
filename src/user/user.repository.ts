import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserDto } from './dto/user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(userInfo) {
    return await this.prisma.user
      .upsert({
        where: { sub: userInfo.sub },
        update: {},
        create: {
          sub: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          studentId: userInfo.student_id,
          phoneNumber: userInfo.phone_number,
        },
      })
      .catch((error) => {
        this.logger.debug(error);
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async getSelf(userInfo): Promise<UserDto> {
    return await this.prisma.user
      .findUnique({
        where: { sub: userInfo.sub },
      })
      .then((user) => {
        if (!user) throw new NotFoundException('User uuid is not found');
        return user;
      });
  }

  async getSubscribedCategories(user) {
    return await this.prisma.userSubscription
      .findMany({
        where: {
          userId: user.id,
        },
        select: {
          category: {
            select: {
              id: true,
              _count: {
                select: {
                  posts: {
                    where: { authorId: user.id },
                  },
                },
              },
            },
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

  async getUserPosts(user) {
    return await this.prisma.post.findMany({
      where: {
        authorId: user.id,
      },
    });
  }

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

  async subscribeCateogry(user, category: number) {
    await this.prisma.userSubscription
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

  async unsubscribeCategory(user, category: number) {
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
