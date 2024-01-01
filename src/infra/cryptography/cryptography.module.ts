import { Module } from '@nestjs/common';

import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';
import { IEncrypter } from '@/domain/forum/application/cryptography/IEncrypter';
import { IHashComparer } from '@/domain/forum/application/cryptography/IHashComparer';
import { IHashGenerator } from '@/domain/forum/application/cryptography/IHashGenerator';

@Module({
	providers: [
		{ provide: IEncrypter, useClass: JwtEncrypter },
		{ provide: IHashComparer, useClass: BcryptHasher },
		{ provide: IHashGenerator, useClass: BcryptHasher },
	],
	exports: [IEncrypter, IHashComparer, IHashGenerator],
})
export class CryptographyModule {}
