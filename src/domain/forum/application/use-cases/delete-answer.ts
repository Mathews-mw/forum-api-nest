import { Either, failure, success } from '@/core/either';
import { NotallowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IAnswerRepository } from '../repositories/implementations/IAnswerRepository';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotfounError | NotallowedError, null>;

@Injectable()
export class DeleteAnswerUseCase {
	constructor(private answerRepository: IAnswerRepository) {}

	async execute({ authorId, answerId }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) {
			return failure(new ResourceNotfounError());
		}

		if (authorId !== answer.authorId.toString()) {
			return failure(new NotallowedError());
		}

		await this.answerRepository.delete(answer);

		return success(null);
	}
}
