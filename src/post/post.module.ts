import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';
import { PostRepository } from './post.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [HttpModule],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PrismaService,
    UserService,
    UserRepository,
  ],
})
export class PostModule {}
