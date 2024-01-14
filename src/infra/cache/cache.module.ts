import { Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { RedisService } from './redis/redis.service';
import { ICacheRepository } from './ICacheRepository';
import { RedisCacheRepository } from './redis/redis-cache-repository';

@Module({
	imports: [EnvModule],
	providers: [
		RedisService,
		{
			provide: ICacheRepository,
			useClass: RedisCacheRepository,
		},
	],
	exports: [ICacheRepository],
})
export class CacheModule {}
