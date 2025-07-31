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
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly idpUrlToken: string;
  private readonly idpUrlUser: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
  ) {
    this.clientId = this.configService.get<string>('CLIENT_ID') as string;
    this.clientSecret = this.configService.get<string>(
      'CLIENT_SECRET',
    ) as string;
    this.idpUrlToken = this.configService.get<string>(
      'IDP_URL_TOKEN',
    ) as string;
    this.idpUrlUser = this.configService.get<string>('IDP_URL_USER') as string;
  }

  async login(code: string): Promise<TokenDto> {
    // Get Code
    // https://idp.gistory.me/authorize?client_id=7f16b001-6333-4106-8e60-7f397dad86b1&redirect_uri=http://localhost:3000/redirect&response_type=code&scope=profile student_id email phone_number&code_challenge=code_challenge&code_challenge_method=plain

    const response = (
      await firstValueFrom(
        this.httpService.post(
          this.idpUrlToken,
          new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            code_verifier: 'code_challenge',
          }),
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${this.clientId}:${this.clientSecret}`,
              ).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      )
    ).data;

    const userInfo = await this.idpUserInfo(response.access_token);

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

  async getUser(id: string): Promise<UserDto> {
    return await this.userRepository.getUser(id);
  }

  async unsubscribeCategory({ userInfo }, category: number) {
    const user = await this.userRepository.getUser(userInfo);

    if (!user) throw new NotFoundException('User id is not found');

    return this.userRepository.unsubscribeCategory(user, category);
  }

  async deleteUser(id: string) {
    return await this.userRepository.deleteUser(id);
  }

  async idpUserInfo(token: string) {
    return (
      await firstValueFrom(
        this.httpService.get(this.idpUrlUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      )
    ).data;
  }
}
