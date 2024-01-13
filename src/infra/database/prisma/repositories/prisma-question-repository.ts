import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { DomainEvents } from '@/core/events/domain-events';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionAttchmentsRepository';

@Injectable()
export class PrismaQuestionRepository implements IQuestionRepository {
	constructor(
		private prisma: PrismaService,
		private questionAttachmentsRepository: IQuestionAttachmentsRepository
	) {}

	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		await this.prisma.question.create({
			data,
		});

		await this.questionAttachmentsRepository.createMany(question.attachments.getItems());

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		Promise.all([
			this.prisma.question.update({
				data,
				where: {
					id: data.id,
				},
			}),
			this.questionAttachmentsRepository.createMany(question.attachments.getNewItems()),
			this.questionAttachmentsRepository.createMany(question.attachments.getRemovedItems()),
		]);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);

		await this.prisma.question.delete({
			where: {
				id: data.id,
			},
		});
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

	async findBySlug(slug: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
			include: {
				author: true,
				attachments: true,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionDetailsMapper.toDomain(question);
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return questions.map(PrismaQuestionMapper.toDomain);
	}
}
