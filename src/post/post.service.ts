import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { firstValueFrom, from, mergeMap, toArray } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UserDto } from 'src/user/dto/user.dto';
import { PostRepository } from './post.repository';
import { UserRepository } from 'src/user/user.repository';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  private readonly pushServer: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly configService: ConfigService,
  ) {
    this.pushServer = configService.get<string>('PUSH_SERVER') as string;
  }

  async getPost(id: string) {
    return await this.postRepository.getPost(id);
  }

  async makePost(body: CreatePostDto, { userInfo }) {
    const user = await this.userRepository.getSelf(userInfo);

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
              this.httpService.post(this.pushServer, {
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

    return await this.postRepository.makePost(body, user);
  }

  async updatePost(id: string, body: CreatePostDto) {
    return await this.postRepository.updatePost(id, body);
  }

  async deletePost(id: string) {
    return await this.postRepository.deletePost(id);
  }

  async getCategories() {
    return await this.postRepository.getCategories();
  }

  async getCategoriesSubscribers() {
    return await this.postRepository.getCategoriesSubscribers();
  }

  async addCategory(category: string) {
    return await this.postRepository.addCategory(category);
  }

  async deleteCategory(category: string) {
    return await this.postRepository.deleteCategory(category);
  }
}
