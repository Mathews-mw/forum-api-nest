import { compare, hash } from 'bcryptjs';

import { IHashComparer } from '@/domain/forum/application/cryptography/IHashComparer';
import { IHashGenerator } from '@/domain/forum/application/cryptography/IHashGenerator';

export class BcryptHasher implements IHashGenerator, IHashComparer {
	private HASH_SALT_LENGTH = 8;

	hash(plain: string): Promise<string> {
		return hash(plain, this.HASH_SALT_LENGTH);
	}

	compare(plain: string, hash: string): Promise<boolean> {
		return compare(plain, hash);
	}
}
