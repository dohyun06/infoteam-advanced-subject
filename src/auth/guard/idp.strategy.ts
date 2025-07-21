import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from '../auth.service';

@Injectable()
export class IdPStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const userInfo = this.authService.idpUserInfo(token);
    return { userInfo, token };
  }
}
