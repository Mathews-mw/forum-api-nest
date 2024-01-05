import { Injectable } from '@nestjs/common';

import { Either, success } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { IAnswerRepository } from '../repositories/implementations/IAnswerRepository';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachments-list';

interface AnswerQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
	attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
	null,
	{
		answer: Answer;
	}
>;

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answerRepository: IAnswerRepository) {}

	async execute({ questionId, content, authorId, attachmentsIds }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
			content,
		});

		const answerAttachments = attachmentsIds.map((attachmentsId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentsId),
				answerId: answer.id,
			});
		});

		answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answerRepository.create(answer);

		return success({
			answer,
		});
	}
}
