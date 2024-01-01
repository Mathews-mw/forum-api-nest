import { Injectable } from '@nestjs/common';

import { IEncrypter } from '../cryptography/IEncrypter';
import { Either, failure, success } from '@/core/either';
import { IHashComparer } from '../cryptography/IHashComparer';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { IStudentRepository } from '../repositories/implementations/IStudendtRepository';

interface AuthenticateStudentUseCaseRequest {
	email: string;
	password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
	WrongCredentialsError,
	{
		accessToken: string;
	}
>;

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private studentRepository: IStudentRepository,
		private hashComparer: IHashComparer,
		private encrypter: IEncrypter
	) {}

	async execute({ email, password }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentRepository.findByEmail(email);

		if (!student) {
			return failure(new WrongCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(password, student.password);

		if (!isPasswordValid) {
			return failure(new WrongCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({ sub: student.id.toString() });

		return success({
			accessToken,
		});
	}
}
