import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { HttpModule } from '@nestjs/axios';
import { AuthRepository } from './auth.repository';
import { IdPStrategy } from './guard/idp.guard';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PrismaService,
    UserService,
    IdPStrategy,
  ],
})
export class AuthModule {}
