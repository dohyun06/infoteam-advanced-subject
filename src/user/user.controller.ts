import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { GetUserDto } from './dto/getUser.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { SubscribeCategoryDto } from './dto/subscribeCategory.dto';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { UserRepository } from './user.repository';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'create a user' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async login(@Query() { code }: LoginDto): Promise<TokenDto> {
    return await this.userService.login(code);
  }

  @Get('subscribe')
  @ApiBearerAuth()
  @UseGuards(IdPGuard)
  async getSubscribedCategories(@Req() req: Request & { user; token }) {
    return await this.userService.getSubscribedCategories(req.user);
  }

  @Get('post')
  @ApiBearerAuth()
  @UseGuards(IdPGuard)
  async getUserPosts(@Req() req: Request & { user; token }) {
    return await this.userService.getUserPosts(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a user' })
  @ApiOkResponse({ type: UserDto, description: 'Return a user' })
  @ApiParam({ name: 'id', description: 'id of a user', type: String })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async getUser(@Param() { id }: GetUserDto): Promise<UserDto> {
    return await this.userRepository.getUser(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a user' })
  @ApiParam({ name: 'id', description: 'id of a user', type: String })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async deleteUser(@Param() { id }: GetUserDto): Promise<UserDto> {
    return await this.userRepository.deleteUser(id);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'subscribe a category' })
  @ApiBody({ type: SubscribeCategoryDto })
  @ApiOkResponse({ type: UserDto, description: 'Return a subscription' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBearerAuth()
  @UseGuards(IdPGuard)
  async subscribeCategory(
    @Body() { category }: SubscribeCategoryDto,
    @Req() req: Request & { user; token },
  ) {
    return await this.userService.subscribeCategory(req.user, category);
  }

  @Post('unsubscribe')
  @ApiOperation({ summary: 'unsubscribe a category' })
  @ApiBody({ type: SubscribeCategoryDto })
  @ApiOkResponse({ type: UserDto, description: 'Return a unsubscription' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async unsubscribeCategory(
    @Body() { category }: SubscribeCategoryDto,
    @Req() req: Request & { user; token },
  ) {
    return await this.userService.unsubscribeCategory(req.user, category);
  }
}
