import { Injectable } from '@nestjs/common';

import { RedisService } from './redis.service';
import { ICacheRepository } from '../ICacheRepository';

@Injectable()
export class RedisCacheRepository implements ICacheRepository {
	constructor(private redis: RedisService) {}

	async set(key: string, value: string): Promise<void> {
		await this.redis.set(key, value, 'EX', 60 * 15); // Esse cache irá exprirar no intervalo de 15 min. O EX indica que a expiração do cache deve ser em segundos
	}

	async get(key: string): Promise<string | null> {
		const value = await this.redis.get(key);

		return value;
	}

	async delete(key: string): Promise<void> {
		await this.delete(key);
	}
}
