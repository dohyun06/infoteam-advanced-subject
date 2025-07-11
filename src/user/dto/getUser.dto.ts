import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  @ApiProperty({ example: 'abcde' })
  id: string;
}
