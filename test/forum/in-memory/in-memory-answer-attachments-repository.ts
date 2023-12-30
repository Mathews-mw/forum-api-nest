import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { IAnswerAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerAttachmentsRepository';

export class InMemoryAnswerAttachmentsRepository implements IAnswerAttchmentsRepository {
	public items: AnswerAttachment[] = [];

	async findManyByAnswerId(answerId: string) {
		const answerAttachments = this.items.filter((item) => item.answerId.toString() === answerId);

		return answerAttachments;
	}

	async deleteManyByAnswerId(answerId: string) {
		const answerAttachments = this.items.filter((item) => item.answerId.toString() !== answerId);

		this.items = answerAttachments;
	}
}
