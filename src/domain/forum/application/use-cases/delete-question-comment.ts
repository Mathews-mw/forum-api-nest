import { Either, failure, success } from '@/core/either';
import { NotallowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IQuestionCommentsRepository } from '../repositories/implementations/IQuestionCommentsRepository';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string;
	questionId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotfounError | NotallowedError, null>;

@Injectable()
export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentRepository: IQuestionCommentsRepository) {}

	async execute({ authorId, questionId }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment = await this.questionCommentRepository.findById(questionId);

		if (!questionComment) {
			return failure(new ResourceNotfounError());
		}

		if (questionComment.authorId.toString() !== authorId) {
			return failure(new NotallowedError());
		}

		await this.questionCommentRepository.delete(questionComment);

		return success(null);
	}
}
