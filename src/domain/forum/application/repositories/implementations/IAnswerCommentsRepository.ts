import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export interface IAnswerCommentsRepository {
	create(answerComment: AnswerComment): Promise<void>;
	delete(answerComment: AnswerComment): Promise<void>;
	findById(id: string): Promise<AnswerComment | null>;
	findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;
}
