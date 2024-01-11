import { DomainEvents } from '@/core/events/domain-events';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryAttachmentsRepository } from './in-memmory-attachments-repository';
import { InMemoryQestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class InMemoryQuestionRepository implements IQuestionRepository {
	public items: Question[] = [];

	constructor(
		private questionattachmentsRepository: InMemoryQestionAttachmentsRepository,
		private attachmentRepository: InMemoryAttachmentsRepository,
		private studentRepository: InMemoryStudentsRepository
	) {}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		await this.questionattachmentsRepository.createMany(question.attachments.getItems());

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[questionIndex] = question;

		await this.questionattachmentsRepository.createMany(question.attachments.getNewItems());
		await this.questionattachmentsRepository.deleteMany(question.attachments.getRemovedItems());

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

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const question = this.items.find((question) => question.slug.value === slug);

		if (!question) {
			return null;
		}

		const author = this.studentRepository.items.find((student) => student.id.equals(question.authorId));

		if (!author) {
			throw new Error(`Author with ID "${question.id.toString()}" does not exist`);
		}

		const questionAttachments = this.questionattachmentsRepository.items.filter((questionAttachment) => questionAttachment.questionId.equals(question.id));

		const attachments = questionAttachments.map((questionAttachment) => {
			const attachment = this.attachmentRepository.items.find((attachment) => {
				return attachment.id.equals(questionAttachment.attachmentId);
			});

			if (!attachment) {
				throw new Error(`Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist`);
			}

			return attachment;
		});

		return QuestionDetails.create({
			questionId: question.id,
			authorId: question.authorId,
			author: author.name,
			title: question.title,
			slug: question.slug,
			content: question.content,
			bestAnswerId: question.bestAnswerId,
			attachments,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		});
	}

	async findManyRecent({ page }: PaginationParams) {
		const questions = this.items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice((page - 1) * 20, page * 20);

		return questions;
	}
}
