import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getPost(id: string) {
    return await this.prisma.post
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((post) => {
        if (!post) throw new NotFoundException('Post uuid is not found');
        return post;
      });
  }

  async makePost(body: CreatePostDto) {
    const users: UserDto[] = await this.prisma.user.findMany({
      where: {
        subscriptions: { some: { categoryId: body.category } },
      },
    });

    const observable = new Observable((subscriber) => {
      users.forEach((user) => {
        console.log(user.id);
        subscriber.next(user.id);
      });
    });

    observable.subscribe({
      next: async (id) => {
        const response = await firstValueFrom(
          this.httpService.post('http://localhost:8090/api/push', {
            deviceId: id,
          }),
        );
        console.log(response.data);
      },
    });

    return await this.prisma.post
      .create({
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
