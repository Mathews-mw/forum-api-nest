import { Either, success } from '@/core/either';
import { NotallowedError } from '../../../../core/errors/not-allowed-error';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IAnswerCommentsRepository } from '../repositories/implementations/IAnswerCommentsRepository';

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string;
	answerId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotfounError | NotallowedError, null>;

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentRepository: IAnswerCommentsRepository) {}

	async execute({ authorId, answerId }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment = await this.answerCommentRepository.findById(answerId);

		if (!answerComment) {
			throw new Error('Answer comment not found.');
		}

		if (answerComment.authorId.toString() !== authorId) {
			throw new Error('Not allowed.');
		}

		await this.answerCommentRepository.delete(answerComment);

		return success(null);
	}
}
