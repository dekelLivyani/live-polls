import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsString, MinLength} from 'class-validator'

export class RegisterDto {
    @ApiProperty({
        description: 'First name of the user',
        required: true
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        description: 'Last name of the user',
        required: true
    })
    @IsString()
    lastName: string;

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

    @ApiProperty({
        description: 'Password confirmation for the user account',
        required: true
    })
    @MinLength(8)
    verifyPassword: string;
}
