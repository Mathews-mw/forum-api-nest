import { PaginationParams } from '@/core/repositories/pagination-params';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionCommentsRepository';

export class InMemmoryQuestionCommentsRepository implements IQuestionCommentsRepository {
	public items: QuestionComment[] = [];

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

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

	async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)
			.map((comment) => {
				const author = this.studentsRepository.items.find((student) => student.id.equals(comment.authorId));

				if (!author) {
					throw new Error(`Author ID "${comment.authorId.toString()}" does not exists.`);
				}

				return CommentWithAuthor.create({
					commentId: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					authorId: comment.authorId,
					author: author.name,
				});
			});

		return questionComments;
	}
}
