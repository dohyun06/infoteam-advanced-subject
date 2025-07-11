import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: 'this is title' })
  readonly title: string;

  @IsString()
  @ApiProperty({ example: 'this is content' })
  readonly content: string;

  @IsString()
  @ApiProperty({ example: 'this is category' })
  readonly category: string;
}
