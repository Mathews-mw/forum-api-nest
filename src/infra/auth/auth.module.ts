import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			global: true,
			useFactory(env: EnvService) {
				const privateKey = env.get('JWT_PRIVATE_KEY');
				const publicKey = env.get('JWT_PUBLIC_KEY');

				return {
					signOptions: { algorithm: 'RS256' },
					privateKey: Buffer.from(privateKey, 'base64'),
					publicKey: Buffer.from(publicKey, 'base64'),
				};
			},
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		JwtStrategy,
		EnvService,
	],
})
export class AuthModule {}
