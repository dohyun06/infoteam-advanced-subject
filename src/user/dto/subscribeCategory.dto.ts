import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SubscribeCategoryDto {
  @IsString()
  @ApiProperty({ example: 'abcde' })
  id: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ example: 1 })
  category: number;
}
