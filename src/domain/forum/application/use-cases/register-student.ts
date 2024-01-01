import { Injectable } from '@nestjs/common';

import { Either, failure, success } from '@/core/either';
import { Student } from '../../enterprise/entities/student';
import { IHashGenerator } from '../cryptography/IHashGenerator';
import { StudentAlreadyExistsError } from './errors/student-already-exists-error';
import { IStudentRepository } from '../repositories/implementations/IStudendtRepository';

interface RegisterStudentUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

type RegisterStudentUseCaseResponse = Either<
	StudentAlreadyExistsError,
	{
		student: Student;
	}
>;

@Injectable()
export class RegisterStudentUseCase {
	constructor(
		private studentRepository: IStudentRepository,
		private hashGenerator: IHashGenerator
	) {}

	async execute({ name, email, password }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
		const studentWithSameEmail = await this.studentRepository.findByEmail(email);

		if (studentWithSameEmail) {
			return failure(new StudentAlreadyExistsError(email));
		}

		const hashPassword = await this.hashGenerator.hash(password);

		const student = Student.create({
			name,
			email,
			password: hashPassword,
		});

		await this.studentRepository.create(student);

		return success({
			student,
		});
	}
}
