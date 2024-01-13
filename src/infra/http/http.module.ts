import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/storage.module';
import { DatabaseModule } from '../database/databbase.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer-use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question-use-case';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-anwer-use-case';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question-use-case';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers-use-case';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer-use-case';

import { EditAnswerController } from './controllers/edit-answer.controller';
import { AuthenticateController } from './controllers/authenticate-controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { ReadNotificationController } from './controllers/read-notification.controller';
import { CommentOnquestionController } from './controllers/comment-on-question.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller';
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller';
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';

@Module({
	imports: [DatabaseModule, CryptographyModule, StorageModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		EditQuestionController,
		DeleteQuestionController,
		GetQuestionBySlugController,
		FetchRecentQuestionsController,
		ChooseQuestionBestAnswerController,
		CommentOnquestionController,
		DeleteQuestionCommentController,
		AnswerQuestionController,
		FetchQuestionCommentsController,
		EditAnswerController,
		DeleteAnswerController,
		FetchQuestionAnswersController,
		CommentOnAnswerController,
		DeleteAnswerCommentController,
		FetchAnswerCommentsController,
		UploadAttachmentController,
		ReadNotificationController,
	],
	providers: [
		RegisterStudentUseCase,
		AuthenticateStudentUseCase,
		CreateQuestionUseCase,
		EditQuestionUseCase,
		DeleteQuestionUseCase,
		GetQuestionBySlugUseCase,
		FetchRecentQuestionsUseCase,
		ChooseQuestionBestAnswerUseCase,
		CommentOnQuestionUseCase,
		DeleteQuestionCommentUseCase,
		FetchQuestionCommentsUseCase,
		AnswerQuestionUseCase,
		EditAnswerUseCase,
		DeleteAnswerUseCase,
		FetchQuestionAnswersUseCase,
		CommentOnAnswerUseCase,
		DeleteAnswerCommentUseCase,
		FetchAnswerCommentsUseCase,
		ReadNotificationUseCase,
	],
})
export class HttpModule {}
