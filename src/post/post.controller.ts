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
import { CreatePostDTO } from './dto/createPost.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostParamDTO } from './dto/createPostParam.dto';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { CategoryDto } from './dto/category.dto';

@Controller('post')
@UseFilters(new HttpExceptionFilter())
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':uuid')
  @ApiOperation({ summary: 'get a post' })
  @ApiOkResponse({ type: CreatePostDTO, description: 'Return posts' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async sendPost(@Param() { uuid }: CreatePostParamDTO) {
    return await this.postService.getPost(uuid);
  }

  @Post()
  @ApiOperation({ summary: 'generate a post' })
  @ApiBody({ type: CreatePostDTO })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async createPost(@Body() body: CreatePostDTO) {
    return await this.postService.makePost(body);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'update a post' })
  @ApiBody({ type: CreatePostDTO })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async updatePost(
    @Param() { uuid }: CreatePostParamDTO,
    @Body() body: CreatePostDTO,
  ) {
    return await this.postService.updatePost(uuid, body);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'delete a post' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async deletePost(@Param() { uuid }: CreatePostParamDTO) {
    return await this.postService.deletePost(uuid);
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
