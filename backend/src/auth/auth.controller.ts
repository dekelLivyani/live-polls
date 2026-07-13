import {ConflictException, Controller, Post, Body, UnauthorizedException, Res} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import { Prisma } from "@prisma/client";
import { Response } from 'express'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() payload: LoginDto, @Res() res: Response) {
        try {
            const { user, accessToken, refreshToken } = await this.authService.login(payload);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
            })
            res.json({
                status:  'OK',
                timestamp: new Date().toISOString(),
                accessToken,
                user
            })
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials')
        }
    }

    @Post('register')
    async register(@Body() payload: RegisterDto, @Res() res: Response) {
        try {
            const { user, accessToken, refreshToken } = await this.authService.register(payload);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
            })
            res.json({
                status:  'OK',
                timestamp: new Date().toISOString(),
                accessToken,
                user
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                throw new ConflictException('Email already exists')
            }
            throw new UnauthorizedException('Fail to register user')
        }
    }
}
