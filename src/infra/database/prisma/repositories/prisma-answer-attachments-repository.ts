import { Injectable } from '@nestjs/common';

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { IAnswerAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerAttachmentsRepository';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements IAnswerAttchmentsRepository {
	findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		throw new Error('Method not implemented.');
	}

	deleteManyByAnswerId(answerId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
