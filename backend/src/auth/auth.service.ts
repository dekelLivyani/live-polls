import {HttpException, HttpStatus, Injectable, UnprocessableEntityException} from "@nestjs/common";
import { compare, hash } from 'bcrypt'
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import { JwtUser } from "./auth.interface";
import {RedisService} from "../redis/redis.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly redis: RedisService
    ) {
    }
    async register(payload: RegisterDto){
        const { firstName, lastName, email, password, verifyPassword } = payload;
        if (password !== verifyPassword) {
            throw new UnprocessableEntityException('Passwords do not match')
        }
        const passwordWithHash = await hash(password, 10)
        const user = await this.prisma.user.create({ data: { firstName, lastName, email, passwordHash: passwordWithHash } })
        const userPayload: JwtUser  = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        const { accessToken, refreshToken } = this.generateTokens(userPayload);
        const { passwordHash, ...safeUser } = user
        return {
            user: safeUser,
            accessToken,
            refreshToken
        }
    }

    async login(payload: LoginDto){
        const { email, password } = payload;
        const rateLimitCount: string | null = await this.redis.get(`login-attempts:${email}`)
        if(rateLimitCount && parseInt(rateLimitCount) >= 5){
            throw new HttpException('Too many login attempts, try again later', HttpStatus.TOO_MANY_REQUESTS)
        }
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user){
            throw new Error('Invalid credentials')
        }
        const passwordFromDB = user.passwordHash;
        const isValid = await compare(password, passwordFromDB)
        if(!isValid){
            await this.redis.incr(`login-attempts:${email}`)
            if(!rateLimitCount) {
                await this.redis.expire(`login-attempts:${email}`, 900)
            }
            throw new Error('Invalid credentials')
        }
        await this.redis.del(`login-attempts:${email}`)
        const userPayload: JwtUser  = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        const { accessToken, refreshToken } = this.generateTokens(userPayload);
        const { passwordHash, ...safeUser } = user
       return {
           user: safeUser,
           accessToken,
           refreshToken
       }
    }

    generateTokens(user: JwtUser){
        const accessToken = this.jwtService.sign(user,{ secret: process.env.JWT_SECRET , expiresIn: '30m' })
        const refreshToken = this.jwtService.sign(user,{ secret: process.env.JWT_REFRESH_SECRET , expiresIn: '7d' })
        return { accessToken, refreshToken }
    }
}
