import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export interface IQuestionAttchmentsRepository {
	findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
	deleteManyByQuestionId(questionId: string): Promise<void>;
}
