import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerCommentsRepository';

@Injectable()
export class PrismaAnswerCommentsRepository implements IAnswerCommentsRepository {
	create(answerComment: AnswerComment): Promise<void> {
		throw new Error('Method not implemented.');
	}

	delete(answerComment: AnswerComment): Promise<void> {
		throw new Error('Method not implemented.');
	}

	findById(id: string): Promise<AnswerComment | null> {
		throw new Error('Method not implemented.');
	}

	findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
		throw new Error('Method not implemented.');
	}
}
