import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetPostDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly id: number;

  @IsString()
  @ApiProperty({ example: 'this is title' })
  readonly title: string;

  @IsString()
  @ApiProperty({ example: 'this is content' })
  readonly content: string;
}
