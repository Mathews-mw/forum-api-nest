import { Either, failure, success } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';
import { IQuestionCommentsRepository } from '../repositories/implementations/IQuestionCommentsRepository';
import { Injectable } from '@nestjs/common';

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotfounError,
	{
		questionComment: QuestionComment;
	}
>;

@Injectable()
export class CommentOnQuestionUseCase {
	constructor(
		private questionRepository: IQuestionRepository,
		private questionCommentsRepository: IQuestionCommentsRepository
	) {}

	async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId);

		if (!question) {
			return failure(new ResourceNotfounError());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
			content,
		});

		await this.questionCommentsRepository.create(questionComment);

		return success({
			questionComment,
		});
	}
}
