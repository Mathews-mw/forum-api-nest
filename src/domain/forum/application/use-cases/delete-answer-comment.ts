import { Either, failure, success } from '@/core/either';
import { NotallowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IAnswerCommentsRepository } from '../repositories/implementations/IAnswerCommentsRepository';

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotfounError | NotallowedError, {}>;

export class DeleteQuestionCommentUseCase {
	constructor(private answerCommentRepository: IAnswerCommentsRepository) {}

	async execute({ authorId, answerCommentId }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment = await this.answerCommentRepository.findById(answerCommentId);

		if (!answerComment) {
			return failure(new ResourceNotfounError());
		}

		if (answerComment.authorId.toString() !== authorId) {
			return failure(new NotallowedError());
		}

		await this.answerCommentRepository.delete(answerComment);

		return success({});
	}
}
