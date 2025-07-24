import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserService } from '../user.service';

@Injectable()
export class IdPStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(token: string) {
    const userInfo = await this.userService.idpUserInfo(token);
    return { userInfo, token };
  }
}
