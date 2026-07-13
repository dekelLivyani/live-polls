import {Injectable, UnprocessableEntityException} from "@nestjs/common";
import { compare, hash } from 'bcrypt'
import {PrismaService} from "../prisma/prisma.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import { JwtUser } from "./auth.interface";

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {
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
            throw new Error('Invalid credentials')
        }
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
