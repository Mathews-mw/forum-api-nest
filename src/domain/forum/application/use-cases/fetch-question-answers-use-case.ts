import { Injectable } from '@nestjs/common';
import { Either, success } from '@/core/either';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { IAnswerRepository } from '../repositories/implementations/IAnswerRepository';

interface FetchQuestionAnswersUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
	null,
	{
		answers: Answer[];
	}
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
	constructor(private answerRepository: IAnswerRepository) {}

	async execute({ questionId, page }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answerRepository.findManyByQuestionId(questionId, { page });

		return success({
			answers,
		});
	}
}
