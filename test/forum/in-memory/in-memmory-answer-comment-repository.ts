import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerCommentsRepository';
import { PaginationParams } from '@/core/repositories/pagination-params';

export class InMemmoryAnswerCommentsRepository implements IAnswerCommentsRepository {
	public items: AnswerComment[] = [];

	async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment);
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		const questionIndex = this.items.findIndex((item) => item.id === answerComment.id);

		this.items.splice(questionIndex, 1);
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answer = this.items.find((answer) => answer.id.toString() === id);

		if (!answer) {
			return null;
		}

		return answer;
	}

	async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
		const answerComments = this.items.filter((item) => item.answerId.toString() === answerId).slice((page - 1) * 20, page * 20);

		return answerComments;
	}
}
