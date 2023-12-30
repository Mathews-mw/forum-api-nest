import { Question } from '@/domain/forum/enterprise/entities/question';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';
import { Either, success } from '@/core/either';

interface FetchRecentQuestionsUseCaseRequest {
	page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
	null,
	{
		questions: Question[];
	}
>;

export class FetchRecentQuestionsUseCase {
	constructor(private questionRepository: IQuestionRepository) {}

	async execute({ page }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionRepository.findManyRecent({ page });

		return success({
			questions,
		});
	}
}
