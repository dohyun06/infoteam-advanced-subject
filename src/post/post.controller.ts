import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import {
  ApiBearerAuth,
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
import { IdPGuard } from 'src/user/guard/idp.guard';

@Controller('post')
@UseFilters(new HttpExceptionFilter())
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('category')
  @ApiOperation({ summary: 'get categories and counts of posts' })
  async getCategories() {
    return await this.postService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a post' })
  @ApiOkResponse({ type: CreatePostDto, description: 'Return posts' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async getPost(@Param() { id }: CreatePostParamDto) {
    return await this.postService.getPost(id);
  }

  @Post()
  @ApiOperation({ summary: 'generate a post' })
  @ApiBody({ type: CreatePostDto })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBearerAuth()
  @UseGuards(IdPGuard)
  async createPost(
    @Body() body: CreatePostDto,
    @Req() req: Request & { user; token },
  ) {
    return await this.postService.makePost(body, req.user);
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

  @Get('category/subscribers')
  @ApiOperation({ summary: 'get how many user subscribe the categories' })
  async getCategorySubscribers() {
    return this.postService.getCategoriesSubscribers();
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
