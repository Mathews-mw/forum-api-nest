import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionCommentsRepository';

@Injectable()
export class PrismaQuestionCommentsRepository implements IQuestionCommentsRepository {
	create(questionComment: QuestionComment): Promise<void> {
		throw new Error('Method not implemented.');
	}

	delete(questionComment: QuestionComment): Promise<void> {
		throw new Error('Method not implemented.');
	}

	findById(id: string): Promise<QuestionComment | null> {
		throw new Error('Method not implemented.');
	}

	findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
		throw new Error('Method not implemented.');
	}
}
