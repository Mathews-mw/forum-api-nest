import { Injectable } from '@nestjs/common';

import { Either, success } from '@/core/either';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { IQuestionCommentsRepository } from '../repositories/implementations/IQuestionCommentsRepository';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[];
	}
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: IQuestionCommentsRepository) {}

	async execute({ questionId, page }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const comments = await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(questionId, { page });

		return success({
			comments,
		});
	}
}
