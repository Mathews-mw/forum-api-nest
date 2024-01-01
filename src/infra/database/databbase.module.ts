import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comment-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository';
import { IStudentRepository } from '@/domain/forum/application/repositories/implementations/IStudendtRepository';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';
import { PrismaQestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';

@Module({
	providers: [
		PrismaService,
		PrismaAnswerRepository,
		{
			provide: IQuestionRepository,
			useClass: PrismaQuestionRepository,
		},
		{
			provide: IStudentRepository,
			useClass: PrismaStudentRepository,
		},
		PrismaAnswerCommentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaAnswerAttachmentsRepository,
		PrismaQestionAttachmentsRepository,
	],
	exports: [
		PrismaService,
		PrismaAnswerRepository,
		IQuestionRepository,
		IStudentRepository,
		PrismaAnswerCommentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaAnswerAttachmentsRepository,
		PrismaQestionAttachmentsRepository,
	],
})
export class DatabaseModule {}
