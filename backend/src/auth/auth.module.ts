import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    controllers: [AuthController],
    imports: [
        JwtModule.register({secret: process.env.JWT_SECRET, signOptions: { expiresIn: process.env.JWT_EXPIRES }}),
    ],
    providers: [AuthService],
})
export class AuthModule {}
