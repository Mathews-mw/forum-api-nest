import { Either, success } from '@/core/either';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { IAnswerCommentsRepository } from '../repositories/implementations/IAnswerCommentsRepository';
import { Injectable } from '@nestjs/common';

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{
		answerComments: AnswerComment[];
	}
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}

	async execute({ answerId, page }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, { page });

		return success({
			answerComments,
		});
	}
}
