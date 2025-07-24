import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { firstValueFrom, from, mergeMap, toArray } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UserDto } from 'src/user/dto/user.dto';
import { PostRepository } from './post.repository';
import { UserRepository } from 'src/user/user.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly configService: ConfigService,
  ) {}

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

    const pushServer = this.configService.get<string>('PUSH_SERVER');

    from(users)
      .pipe(
        mergeMap(async (user) => {
          (
            await firstValueFrom(
              this.httpService.post(`http://${pushServer}:8090/api/push`, {
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
}
