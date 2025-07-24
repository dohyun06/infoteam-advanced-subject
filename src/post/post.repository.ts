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

@Injectable()
export class PostRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
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
}
