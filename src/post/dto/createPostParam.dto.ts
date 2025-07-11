import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostParamDto {
  @IsString()
  @ApiProperty({ example: 'abcd' })
  readonly id: string;
}
