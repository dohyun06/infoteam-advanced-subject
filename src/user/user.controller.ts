import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { GetUserDto } from './dto/getUser.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { SubscribeCategoryDto } from './dto/subscribeCategory.dto';

@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'get a user' })
  @ApiOkResponse({ type: UserDto, description: 'Return a user' })
  @ApiParam({ name: 'id', description: 'id of a user', type: String })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async getUser(@Param() { id }: GetUserDto): Promise<UserDto> {
    return await this.userService.getUser(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a user' })
  @ApiParam({ name: 'id', description: 'id of a user', type: String })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async deleteUser(@Param() { id }: GetUserDto): Promise<UserDto> {
    return await this.userService.deleteUser(id);
  }

  @Post('subscribe/:id/:category')
  @ApiOperation({ summary: 'subscribe a category' })
  @ApiOkResponse({ type: UserDto, description: 'Return a subscription' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async subscribeCategory(@Param() { id, category }: SubscribeCategoryDto) {
    return await this.userService.subscribeCategory(id, category);
  }

  @Delete('subscribe/:id/:category')
  @ApiOperation({ summary: 'unsubscribe a category' })
  @ApiOkResponse({ type: UserDto, description: 'Return a unsubscription' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async unsubscribeCategory(@Param() { id, category }: SubscribeCategoryDto) {
    return await this.userService.unsubscribeCategory(id, category);
  }
}
