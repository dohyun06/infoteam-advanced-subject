import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostParamDto } from './dto/createPostParam.dto';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { CategoryDto } from './dto/category.dto';

@Controller('post')
@UseFilters(new HttpExceptionFilter())
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  @ApiOperation({ summary: 'get a post' })
  @ApiOkResponse({ type: CreatePostDto, description: 'Return posts' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async sendPost(@Param() { id }: CreatePostParamDto) {
    return await this.postService.getPost(id);
  }

  @Post()
  @ApiOperation({ summary: 'generate a post' })
  @ApiBody({ type: CreatePostDto })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async createPost(@Body() body: CreatePostDto) {
    return await this.postService.makePost(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update a post' })
  @ApiBody({ type: CreatePostDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async updatePost(
    @Param() { id }: CreatePostParamDto,
    @Body() body: CreatePostDto,
  ) {
    return await this.postService.updatePost(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a post' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async deletePost(@Param() { id }: CreatePostParamDto) {
    return await this.postService.deletePost(id);
  }

  @Post('category/:category')
  @ApiOperation({ summary: 'add a category' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async addCategory(@Param() { category }: CategoryDto) {
    return await this.postService.addCategory(category);
  }

  @Delete('category/:category')
  @ApiOperation({ summary: 'delete a category' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async deleteCategory(@Param() { category }: CategoryDto) {
    return await this.postService.deleteCategory(category);
  }
}
