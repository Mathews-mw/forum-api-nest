import { Injectable } from '@nestjs/common';
import { Either, failure, success } from '@/core/either';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
	ResourceNotfounError,
	{
		question: Question;
	}
>;

@Injectable()
export class GetQuestionBySlugUseCase {
	constructor(private questionRepository: IQuestionRepository) {}

	async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionRepository.findBySlug(slug);

		if (!question) {
			return failure(new ResourceNotfounError());
		}

		return success({
			question,
		});
	}
}
