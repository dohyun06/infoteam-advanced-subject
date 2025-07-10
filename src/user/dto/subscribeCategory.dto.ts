import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SubscribeCategoryDto {
  @IsString()
  @ApiProperty({ example: 'abcde' })
  uuid: string;

  @IsString()
  @ApiProperty({ example: 'abcde' })
  category: string;
}
