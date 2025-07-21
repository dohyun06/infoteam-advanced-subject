import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import { IdPGuard } from 'src/auth/guard/idp.guard';

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

  @Post('subscribe/:category')
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

  @Delete('subscribe/:category')
  @ApiOperation({ summary: 'unsubscribe a category' })
  @ApiBody({ type: SubscribeCategoryDto })
  @ApiOkResponse({ type: UserDto, description: 'Return a unsubscription' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBearerAuth()
  @UseGuards(IdPGuard)
  async unsubscribeCategory(
    @Body() { category }: SubscribeCategoryDto,
    @Req() req: Request & { user; token },
  ) {
    return await this.userService.unsubscribeCategory(req.user, category);
  }
}
