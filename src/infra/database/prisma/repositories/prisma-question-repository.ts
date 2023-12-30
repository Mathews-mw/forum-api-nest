import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';

@Injectable()
export class PrismaQuestionRepository implements IQuestionRepository {
	constructor(private prisma: PrismaService) {}

	create(question: Question): Promise<void> {
		throw new Error('Method not implemented.');
	}

	save(question: Question): Promise<void> {
		throw new Error('Method not implemented.');
	}

	delete(question: Question): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async findById(id: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				id,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	findBySlug(slug: string): Promise<Question | null> {
		throw new Error('Method not implemented.');
	}

	findManyRecent(params: PaginationParams): Promise<Question[]> {
		throw new Error('Method not implemented.');
	}
}
