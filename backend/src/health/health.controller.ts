import {PrismaService} from "../prisma/prisma.service";
import {RedisService} from "../redis/redis.service";
import {Controller, Get, ServiceUnavailableException} from "@nestjs/common";

@Controller('health')
export class HealthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {}

    @Get()
    async readiness() {
        let isPostgresConnected;
        let isRedisConnected;
        try {
            isPostgresConnected = await this.prisma.postgresHealthCheck();
        } catch (error) {
            isPostgresConnected = false
        }
        try {
            const redisPing = await this.redis.ping();
            isRedisConnected = redisPing === 'PONG';
        } catch (error) {
            isRedisConnected = false;
        }
        if (!isPostgresConnected || !isRedisConnected) {
            throw new ServiceUnavailableException({
                status: 'ERROR',
                timestamp: new Date().toISOString(),
                redis: isRedisConnected ? 'connected' : 'disconnected',
                postgres: isPostgresConnected ? 'connected' : 'disconnected',
            })
        }
            return {
                status:  'OK',
                timestamp: new Date().toISOString(),
                redis: 'connected',
                postgres: 'connected',
            };
        }
    }
