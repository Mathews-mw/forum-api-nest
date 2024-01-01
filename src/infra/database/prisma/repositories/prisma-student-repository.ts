import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { PrismaStudentMapper } from '../mappers/student-question-mapper';
import { IStudentRepository } from '@/domain/forum/application/repositories/implementations/IStudendtRepository';

@Injectable()
export class PrismaStudentRepository implements IStudentRepository {
	constructor(private prisma: PrismaService) {}

	async create(question: Student): Promise<void> {
		const data = PrismaStudentMapper.toPrisma(question);

		await this.prisma.user.create({
			data,
		});
	}

	async findByEmail(email: string): Promise<Student | null> {
		const student = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!student) {
			return null;
		}

		return PrismaStudentMapper.toDomain(student);
	}
}
