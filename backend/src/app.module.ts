import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {RedisModule} from "./redis/redis.module";
import {PrismaModule} from "./prisma/prisma.module";
import {HealthModule} from "./health/health.module";
import {AuthModule} from "./auth/auth.module";
import {PollsModule} from "./polls/polls.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        RedisModule,
        HealthModule,
        AuthModule,
        PollsModule
    ],
})
export class AppModule {

}
