import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDTO } from './dto/createPost.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPost(uuid: string) {
    return await this.prisma.post
      .findUnique({
        where: {
          uuid: uuid,
        },
      })
      .then((post) => {
        if (!post) throw new NotFoundException('Post uuid is not found');
        return post;
      });
  }

  async makePost(body: CreatePostDTO) {
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

  async updatePost(uuid: string, body: CreatePostDTO) {
    return await this.prisma.post
      .update({
        where: {
          uuid: uuid,
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

  async deletePost(uuid: string) {
    return await this.prisma.post
      .delete({
        where: {
          uuid: uuid,
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
