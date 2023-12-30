import { Either, failure, success } from '@/core/either';
import { Question } from '../../enterprise/entities/question';
import { NotallowedError } from '../../../../core/errors/not-allowed-error';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IAnswerRepository } from '../repositories/implementations/IAnswerRepository';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	ResourceNotfounError | NotallowedError,
	{
		question: Question;
	}
>;

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private questionRepository: IQuestionRepository,
		private answerRepository: IAnswerRepository
	) {}

	async execute({ authorId, answerId }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) {
			return failure(new ResourceNotfounError());
		}

		const question = await this.questionRepository.findById(answer.questionId.toString());

		if (!question) {
			return failure(new ResourceNotfounError());
		}

		if (question.authorId.toString() !== authorId) {
			return failure(new NotallowedError());
		}

		question.bestAnswerId = answer.id;

		await this.questionRepository.save(question);

		return success({
			question,
		});
	}
}
