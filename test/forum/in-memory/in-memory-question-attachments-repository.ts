import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionAttchmentsRepository';

export class InMemoryQestionAttachmentsRepository implements IQuestionAttachmentsRepository {
	public items: QuestionAttachment[] = [];

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items.push(...attachments);
	}

	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
		const questionAttchments = this.items.filter((item) => {
			return !attachments.some((attachment) => attachment.equals(item));
		});

		this.items = questionAttchments;
	}

	async findManyByQuestionId(questionId: string) {
		const questionAttachments = this.items.filter((item) => item.questionId.toString() === questionId);

		return questionAttachments;
	}

	async deleteManyByQuestionId(questionId: string) {
		const questionAttachments = this.items.filter((item) => item.questionId.toString() !== questionId);

		this.items = questionAttachments;
	}
}
