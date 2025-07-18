import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SubscribeCategoryDto {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ example: 1 })
  category: number;
}
