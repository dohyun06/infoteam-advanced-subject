import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ example: 'abcde' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'abcde' })
  password: string;
}
