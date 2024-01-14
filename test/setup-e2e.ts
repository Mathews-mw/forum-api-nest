import { config } from 'dotenv';
import { Redis } from 'ioredis';

import { randomUUID } from 'node:crypto';
import { envSchema } from '@/infra/env/env';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { DomainEvents } from '@/core/events/domain-events';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

const redis = new Redis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	db: env.REDIS_DB,
});

function generateUniqueDatabaseURL(schemaId: string) {
	if (!env.DATABASE_URL) {
		throw new Error('Please provider a DATABASE_URL environment variable.');
	}

	const url = new URL(env.DATABASE_URL);

	url.searchParams.set('schema', schemaId);

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseURL = generateUniqueDatabaseURL(schemaId);

	env.DATABASE_URL = databaseURL;

	DomainEvents.shouldRun = false;

	await redis.flushdb(); // Deleta todos os dados de um banco do redis específico. No caso, vai deletar os dados do env.REDIS_DB

	execSync('pnpm prisma migrate deploy');
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

	await prisma.$disconnect();
});
