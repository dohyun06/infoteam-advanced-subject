import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TokenDTO } from './dto/token.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'create a user' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async login(@Query() { code }: LoginDto) {
    return await this.authService.login(code);
  }
}
