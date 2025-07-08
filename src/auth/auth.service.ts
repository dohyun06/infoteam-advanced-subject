import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from './dto/token.dto';
import { UserService } from 'src/user/user.service';
import { PayloadDTO } from './dto/payload.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async login(code: string) {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );
    const headers = {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const body = new URLSearchParams({});
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append('code_verifier', 'code_challenge');

    return (
      await firstValueFrom(
        this.httpService.post('https://api.idp.gistory.me/oauth/token', body, {
          headers,
        }),
      )
    ).data;
  }
}
