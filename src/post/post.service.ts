import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

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
    return await this.prisma.post
      .create({
        data: {
          title: body.title,
          content: body.content,
          category: {
            connect: { name: body.category },
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
            connect: { name: body.category },
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
