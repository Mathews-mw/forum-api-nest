import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionCommentsRepository';

export class InMemmoryQuestionCommentsRepository implements IQuestionCommentsRepository {
	public items: QuestionComment[] = [];

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);
	}

	async delete(question: QuestionComment): Promise<void> {
		const questionIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(questionIndex, 1);
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const answer = this.items.find((answer) => answer.id.toString() === id);

		if (!answer) {
			return null;
		}

		return answer;
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const questionComments = this.items.filter((item) => item.questionId.toString() === questionId).slice((page - 1) * 20, page * 20);

		return questionComments;
	}
}
