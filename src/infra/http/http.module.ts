import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/databbase.module';
import { CryptographyModule } from '../cryptography/cryptography.module';

import { AnswerQuestionController } from './controllers/answer-question.controller';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';

import { AuthenticateController } from './controllers/authenticate-controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question-use-case';

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		EditQuestionController,
		AuthenticateController,
		CreateAccountController,
		AnswerQuestionController,
		CreateQuestionController,
		DeleteQuestionController,
		GetQuestionBySlugController,
		FetchRecentQuestionsController,
	],
	providers: [
		EditQuestionUseCase,
		AnswerQuestionUseCase,
		CreateQuestionUseCase,
		DeleteQuestionUseCase,
		RegisterStudentUseCase,
		GetQuestionBySlugUseCase,
		AuthenticateStudentUseCase,
		FetchRecentQuestionsUseCase,
	],
})
export class HttpModule {}
