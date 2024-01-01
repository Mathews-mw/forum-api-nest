import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/databbase.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate-controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchRecentQuestionsController],
	providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase, AuthenticateStudentUseCase, RegisterStudentUseCase],
})
export class HttpModule {}
