import { Either, success } from '@/core/either';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { IQuestionCommentsRepository } from '../repositories/implementations/IQuestionCommentsRepository';
import { Injectable } from '@nestjs/common';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		questionComments: QuestionComment[];
	}
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: IQuestionCommentsRepository) {}

	async execute({ questionId, page }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page });

		return success({
			questionComments,
		});
	}
}
