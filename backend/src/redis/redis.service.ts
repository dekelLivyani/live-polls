import Redis from "ioredis";
import {ConfigService} from "@nestjs/config";
import {Injectable, OnModuleDestroy} from "@nestjs/common";

@Injectable()
export class RedisService  extends Redis implements OnModuleDestroy{
    constructor(private readonly configService: ConfigService) {
        super(configService.getOrThrow<string>('REDIS_URL'))
    }
    async onModuleDestroy(){
        await this.disconnect()
    }
}
