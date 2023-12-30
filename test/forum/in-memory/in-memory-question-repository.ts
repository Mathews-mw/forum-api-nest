import { DomainEvents } from '@/core/events/domain-events';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';
import { IQuestionAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionAttchmentsRepository';

export class InMemoryQuestionRepository implements IQuestionRepository {
	public items: Question[] = [];

	constructor(private questionattachmentsRepository: IQuestionAttchmentsRepository) {}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[questionIndex] = question;

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(questionIndex, 1);

		this.questionattachmentsRepository.deleteManyByQuestionId(question.id.toString());
	}

	async findById(id: string): Promise<Question | null> {
		const question = this.items.find((question) => question.id.toString() === id);

		if (!question) {
			return null;
		}

		return question;
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((question) => question.slug.value === slug);

		if (!question) {
			return null;
		}

		return question;
	}

	async findManyRecent({ page }: PaginationParams) {
		const questions = this.items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice((page - 1) * 20, page * 20);

		return questions;
	}
}
