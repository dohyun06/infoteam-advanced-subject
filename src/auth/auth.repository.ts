import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(userInfo) {
    return await this.prisma.user
      .findFirst({ where: { sub: userInfo.sub } })
      .then(async (user) => {
        if (!user)
          return await this.prisma.user
            .create({
              data: {
                sub: userInfo.sub,
                name: userInfo.name,
                email: userInfo.email,
                studentId: userInfo.student_id,
                phoneNumber: userInfo.phone_number,
              },
            })
            .catch((error) => {
              this.logger.debug(error);
              if (error instanceof PrismaClientKnownRequestError) {
                throw new InternalServerErrorException('Database Error');
              }
              throw new InternalServerErrorException('Internal Server Error');
            });
        else return user;
      });
  }
}
