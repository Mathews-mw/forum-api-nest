import { Injectable } from '@nestjs/common';
import { Either, success } from '@/core/either';

import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { IAnswerCommentsRepository } from '../repositories/implementations/IAnswerCommentsRepository';

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[];
	}
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}

	async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, { page });

		return success({
			comments,
		});
	}
}
