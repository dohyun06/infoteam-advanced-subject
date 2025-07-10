import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserDTO {
  @IsString()
  @ApiProperty({ example: 'abcde' })
  uuid: string;
}
