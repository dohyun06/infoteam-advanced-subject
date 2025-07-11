import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthRepository } from './auth.repository';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly authRepository: AuthRepository,
  ) {}

  async login(code: string): Promise<TokenDto> {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    const response = (
      await firstValueFrom(
        this.httpService.post(
          'https://api.idp.gistory.me/oauth/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            code_verifier: 'code_challenge',
          }),
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${clientId}:${clientSecret}`,
              ).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      )
    ).data;

    const userInfo = (
      await firstValueFrom(
        this.httpService.get('https://api.idp.gistory.me/oauth/userinfo', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }),
      )
    ).data;

    if (userInfo) {
      this.authRepository.findOrCreateUser(userInfo);
      return {
        access_token: response.access_token,
      };
    }
    throw new UnauthorizedException();
  }
}
