import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PayloadDTO {
  @IsString()
  @ApiProperty({ example: 'abcde' })
  readonly id: string;
}
