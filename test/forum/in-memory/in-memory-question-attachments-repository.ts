import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { IQuestionAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionAttchmentsRepository';

export class InMemoryQestionAttachmentsRepository implements IQuestionAttchmentsRepository {
	public items: QuestionAttachment[] = [];

	async findManyByQuestionId(questionId: string) {
		const questionAttachments = this.items.filter((item) => item.questionId.toString() === questionId);

		return questionAttachments;
	}

	async deleteManyByQuestionId(questionId: string) {
		const questionAttachments = this.items.filter((item) => item.questionId.toString() !== questionId);

		this.items = questionAttachments;
	}
}
