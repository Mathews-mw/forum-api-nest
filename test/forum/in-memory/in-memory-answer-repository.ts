import { DomainEvents } from '@/core/events/domain-events';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { IAnswerRepository } from '@/domain/forum/application/repositories/implementations/IAnswerRepository';
import { IAnswerAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerAttachmentsRepository';

export class InMemoryAnswerRepository implements IAnswerRepository {
	public items: Answer[] = [];

	constructor(private answerAttachmentsRepository: IAnswerAttchmentsRepository) {}

	async create(answer: Answer): Promise<void> {
		this.items.push(answer);

		await this.answerAttachmentsRepository.createMany(answer.attachments.getItems());

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async save(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items[answerIndex] = answer;

		await this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems());
		await this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems());

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async delete(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		this.items.splice(answerIndex, 1);

		this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find((answer) => answer.id.toString() === id);

		if (!answer) {
			return null;
		}

		return answer;
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const answers = this.items.filter((item) => item.questionId.toString() === questionId).slice((page - 1) * 20, page * 20);

		return answers;
	}
}
