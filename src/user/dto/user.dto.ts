import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @ApiProperty({ example: 'abcde' })
  id: string;

  @IsString()
  @ApiProperty({ example: 'abcde' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'abcde' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'abcde' })
  studentId: string;

  @IsString()
  @ApiProperty({ example: 'abcde' })
  phoneNumber: string;
}
