import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreatePostParamDTO {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 1 })
  readonly id: number;
}
