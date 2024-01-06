import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswerRepository } from '@/domain/forum/application/repositories/implementations/IAnswerRepository';

@Injectable()
export class PrismaAnswerRepository implements IAnswerRepository {
	constructor(private prisma: PrismaService) {}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await this.prisma.answer.create({
			data,
		});
	}

	async save(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);

		await this.prisma.answer.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(answer: Answer): Promise<void> {
		await this.prisma.answer.delete({
			where: {
				id: answer.id.toString(),
			},
		});
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		});

		if (!answer) {
			return null;
		}

		return PrismaAnswerMapper.toDomain(answer);
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
		const answer = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return answer.map(PrismaAnswerMapper.toDomain);
	}
}
