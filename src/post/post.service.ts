import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Observable, firstValueFrom, from, map, mergeMap, toArray } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UserDto } from 'src/user/dto/user.dto';
import { response } from 'express';
import { UserService } from 'src/user/user.service';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly postRepository: PostRepository,
  ) {}

  async makePost(body: CreatePostDto, { userInfo }) {
    const user = await this.userService.getSelf(userInfo);

    if (!user) throw new NotFoundException('User id is not found');

    if (
      !(await this.prisma.category.findUnique({ where: { id: body.category } }))
    ) {
      throw new BadRequestException('Bad request, Wrong category id');
    }
    const users: UserDto[] = await this.prisma.user.findMany({
      where: {
        subscriptions: { some: { categoryId: body.category } },
      },
    });

    from(users)
      .pipe(
        mergeMap(async (user) => {
          (
            await firstValueFrom(
              this.httpService.post('http://push-server:8090/api/push', {
                deviceId: user.id,
              }),
            )
          ).data;
        }),
        toArray(),
      )
      .subscribe({
        next: (result) => console.log(result),
        error: (err) => console.error(err),
        complete: () => console.log('Complete'),
      });
    console.log(user, body);

    return await this.prisma.post
      .create({
        data: {
          title: body.title,
          content: body.content,
          author: {
            connect: { id: user.id },
          },
          category: {
            connect: { id: body.category },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async updatePost(id: string, body: CreatePostDto) {
    return await this.prisma.post
      .update({
        where: {
          id: id,
        },
        data: {
          title: body.title,
          content: body.content,
          category: {
            connect: { id: body.category },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Post uuid is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async deletePost(id: string) {
    return await this.prisma.post
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Post uuid is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async getCategories() {
    return await this.prisma.category
      .findMany({
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async getCategoriesSubscribers() {
    return await this.prisma.category
      .findMany({
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              users: true,
            },
          },
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async addCategory(category: string) {
    return await this.prisma.category
      .create({
        data: {
          name: category,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }

  async deleteCategory(category: string) {
    return await this.prisma.category
      .update({
        where: {
          name: category,
        },
        data: {
          status: 'INACTIVE',
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException('Category name is not found');
          }
          throw new InternalServerErrorException('Database Error');
        }
        throw new InternalServerErrorException('Internal Server Error');
      });
  }
}
