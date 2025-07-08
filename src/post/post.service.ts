import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDTO } from './dto/createPost.dto';
import { GetPostDTO } from './dto/getPost.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(): Promise<GetPostDTO[]> {
    return await this.prisma.post.findMany();
  }

  async getPost(id: number): Promise<GetPostDTO> {
    return await this.prisma.post
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((post) => {
        if (!post) throw new NotFoundException(`${id} is not found`);
        return post;
      });
  }

  async makePost(body: CreatePostDTO): Promise<CreatePostDTO> {
    return await this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
      },
    });
  }

  async updatePost(id: number, body: CreatePostDTO): Promise<CreatePostDTO> {
    return await this.prisma.post
      .update({
        where: {
          id: id,
        },
        data: {
          title: body.title,
          content: body.content,
        },
      })
      .catch((err) => {
        throw new InternalServerErrorException();
      });
  }

  async deletePost(id: number): Promise<CreatePostDTO> {
    return await this.prisma.post
      .delete({
        where: {
          id: id,
        },
      })
      .catch((err) => {
        throw new InternalServerErrorException();
      });
  }
}
