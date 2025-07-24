import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from './user.repository';
import { IdPStrategy } from './guard/idp.strategy';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService, IdPStrategy],
})
export class UserModule {}
