import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Student, IStudentProps } from '@/domain/forum/enterprise/entities/student';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/student-question-mapper';

export function makeStudent(override: Partial<IStudentProps> = {}, id?: UniqueEntityId) {
	const student = Student.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id
	);

	return student;
}

@Injectable()
export class StudentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaStudent(data: Partial<IStudentProps> = {}): Promise<Student> {
		const student = makeStudent(data);

		await this.prisma.user.create({
			data: PrismaStudentMapper.toPrisma(student),
		});

		return student;
	}
}
