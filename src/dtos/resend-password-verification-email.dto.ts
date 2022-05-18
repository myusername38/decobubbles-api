import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendPassowrdVerificationEmail {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  @IsString()
  email: string;
}
