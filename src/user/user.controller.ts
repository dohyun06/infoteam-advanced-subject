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
import { GetUserDTO } from './dto/getUser.dto';
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

  @Get(':uuid')
  @ApiOperation({ summary: 'get a user' })
  @ApiOkResponse({ type: UserDto, description: 'Return a user' })
  @ApiParam({ name: 'id', description: 'id of a user', type: String })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async getUser(@Param() { uuid }: GetUserDTO): Promise<UserDto> {
    return await this.userService.getUser(uuid);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'edit password of a user' })
  @ApiParam({ name: 'id', description: 'id of a user', type: String })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async deleteUser(@Param() { uuid }: GetUserDTO): Promise<UserDto> {
    return await this.userService.deleteUser(uuid);
  }

  @Post('subscribe/:uuid/:category')
  @ApiOperation({ summary: 'subscribe a category' })
  @ApiOkResponse({ type: UserDto, description: 'Return a user' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async subscribeCategory(
    @Param() { uuid, category }: SubscribeCategoryDto,
  ): Promise<UserDto> {
    return await this.userService.subscribeCategory(uuid, category);
  }
}
