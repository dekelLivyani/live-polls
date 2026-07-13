import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        description: 'Email address of the user',
        example: 'xxx@gmail.com',
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password for the user account',
        required: true
    })
    @MinLength(8)
    password: string;
}
