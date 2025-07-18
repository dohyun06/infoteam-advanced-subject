import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Strategy } from 'passport-http-bearer';

@Injectable()
export class IdPStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async validate(token: string) {
    const userInfo = (
      await firstValueFrom(
        this.httpService.get('https://api.idp.gistory.me/oauth/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      )
    ).data;
    return { userInfo, token };
  }
}
