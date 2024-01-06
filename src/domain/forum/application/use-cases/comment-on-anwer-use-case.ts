import { Either, failure, success } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IAnswerRepository } from '../repositories/implementations/IAnswerRepository';
import { IAnswerCommentsRepository } from '../repositories/implementations/IAnswerCommentsRepository';
import { Injectable } from '@nestjs/common';

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
	ResourceNotfounError,
	{
		answerComment: AnswerComment;
	}
>;

@Injectable()
export class CommentOnAnswerUseCase {
	constructor(
		private answerRepository: IAnswerRepository,
		private answerCommentsRepository: IAnswerCommentsRepository
	) {}

	async execute({ authorId, answerId, content }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) {
			return failure(new ResourceNotfounError());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(authorId),
			answerId: new UniqueEntityId(answerId),
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return success({
			answerComment,
		});
	}
}
