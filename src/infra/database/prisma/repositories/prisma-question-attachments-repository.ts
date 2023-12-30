import { Injectable } from '@nestjs/common';

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { IQuestionAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionAttchmentsRepository';

@Injectable()
export class PrismaQestionAttachmentsRepository implements IQuestionAttchmentsRepository {
	findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		throw new Error('Method not implemented.');
	}

	deleteManyByQuestionId(questionId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
