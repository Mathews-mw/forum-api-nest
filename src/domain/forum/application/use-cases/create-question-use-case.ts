import { Either, success } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';

interface CreateQuestionUseCaseRequest {
	authorId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
	null,
	{
		question: Question;
	}
>;

export class CreateQuestionUseCase {
	constructor(private questionRepository: IQuestionRepository) {}

	async execute({ authorId, title, content, attachmentsIds }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({ authorId: new UniqueEntityId(authorId), title, content });

		const questionAttachments = attachmentsIds.map((attachmentsId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentsId),
				questionId: question.id,
			});
		});

		question.attachments = new QuestionAttachmentList(questionAttachments);

		await this.questionRepository.create(question);

		return success({
			question,
		});
	}
}
