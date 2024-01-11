import { Injectable } from '@nestjs/common';
import { Either, failure, success } from '@/core/either';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
	ResourceNotfounError,
	{
		question: QuestionDetails;
	}
>;

@Injectable()
export class GetQuestionBySlugUseCase {
	constructor(private questionRepository: IQuestionRepository) {}

	async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionRepository.findDetailsBySlug(slug);

		if (!question) {
			return failure(new ResourceNotfounError());
		}

		return success({
			question,
		});
	}
}
