import { Either, failure, success } from '@/core/either';
import { NotallowedError } from '@/core/errors/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { ResourceNotfounError } from '@/core/errors/resource-not-found-error';
import { IQuestionRepository } from '../repositories/implementations/IQuestionRepository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list';
import { IQuestionAttchmentsRepository } from '../repositories/implementations/IQuestionAttchmentsRepository';

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	ResourceNotfounError | NotallowedError,
	{
		question: Question;
	}
>;

export class EditQuestionUseCase {
	constructor(
		private questionRepository: IQuestionRepository,
		private questionAttachmentsRepository: IQuestionAttchmentsRepository
	) {}

	async execute({ authorId, questionId, title, content, attachmentsIds }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId);

		if (!question) {
			return failure(new ResourceNotfounError());
		}

		if (authorId !== question.authorId.toString()) {
			return failure(new NotallowedError());
		}

		const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

		const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments);

		const questionAttachments = attachmentsIds.map((attachmentsId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentsId),
				questionId: question.id,
			});
		});

		questionAttachmentList.update(questionAttachments);

		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentList;

		await this.questionRepository.save(question);

		return success({
			question,
		});
	}
}
