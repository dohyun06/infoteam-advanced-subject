import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TokenDto } from './dto/token.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(code: string): Promise<TokenDto> {
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    // Get Code
    // https://idp.gistory.me/authorize?client_id=7f16b001-6333-4106-8e60-7f397dad86b1&redirect_uri=http://localhost:3000/redirect&response_type=code&scope=profile student_id email phone_number&code_challenge=code_challenge&code_challenge_method=plain

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

    const userInfo = this.idpUserInfo;

    if (userInfo) {
      this.userRepository.findOrCreateUser(userInfo);
      return {
        access_token: response.access_token,
      };
    }
    throw new UnauthorizedException();
  }

  async getSubscribedCategories({ userInfo }) {
    const user = await this.userRepository.getSelf(userInfo);

    return this.userRepository.getSubscribedCategories(user);
  }

  async getUserPosts({ userInfo }) {
    const user = await this.userRepository.getSelf(userInfo);

    return await this.userRepository.getUserPosts(user);
  }

  async subscribeCategory({ userInfo }, category: number) {
    const user = await this.userRepository.getSelf(userInfo);

    if (!user) throw new NotFoundException('User id is not found');

    return await this.userRepository.subscribeCateogry(user, category);
  }

  async unsubscribeCategory({ userInfo }, category: number) {
    const user = await this.userRepository.getUser(userInfo);

    if (!user) throw new NotFoundException('User id is not found');

    return this.userRepository.unsubscribeCategory(user, category);
  }

  async idpUserInfo(token: string) {
    return (
      await firstValueFrom(
        this.httpService.get('https://api.idp.gistory.me/oauth/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      )
    ).data;
  }
}
