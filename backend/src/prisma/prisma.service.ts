import { PrismaClient } from "@prisma/client";
import {Injectable, OnModuleDestroy, OnModuleInit} from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit(): Promise<void> {
        await this.$connect();
        console.log("Prisma service initialized");
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
        console.log("Prisma service destroyed");
    }

    async postgresHealthCheck(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            console.error('Database health check failed:', error);
            return false;
        }
    }
}
