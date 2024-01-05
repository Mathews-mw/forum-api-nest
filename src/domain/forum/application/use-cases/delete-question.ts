import { Injectable } from '@nestjs/common';

import { Either, failure, success } from '@/core/either';
import { NotallowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';

interface DeleteQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotfounError | NotallowedError, null>;

@Injectable()
export class DeleteQuestionUseCase {
	constructor(private questionRepository: IQuestionRepository) {}

	async execute({ authorId, questionId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId);

		if (!question) {
			return failure(new ResourceNotfounError());
		}

		if (authorId !== question.authorId.toString()) {
			return failure(new NotallowedError());
		}

		await this.questionRepository.delete(question);

		return success(null);
	}
}
