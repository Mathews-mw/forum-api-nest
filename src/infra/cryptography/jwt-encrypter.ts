import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { IEncrypter } from '@/domain/forum/application/cryptography/IEncrypter';

@Injectable()
export class JwtEncrypter implements IEncrypter {
	constructor(private jwtService: JwtService) {}

	encrypt(payload: Record<string, unknown>): Promise<string> {
		return this.jwtService.signAsync(payload);
	}
}
