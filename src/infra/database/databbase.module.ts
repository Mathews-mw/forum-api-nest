import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository';
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachment-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comment-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { IAnswerRepository } from '@/domain/forum/application/repositories/implementations/IAnswerRepository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository';
import { IStudentRepository } from '@/domain/forum/application/repositories/implementations/IStudendtRepository';
import { IQuestionRepository } from '@/domain/forum/application/repositories/implementations/IQuestionRepository';
import { PrismaQestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';
import { IAttachmentRepository } from '@/domain/forum/application/repositories/implementations/IAttachmentRepository';
import { IAnswerCommentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerCommentsRepository';
import { IQuestionCommentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionCommentsRepository';
import { IAnswerAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IAnswerAttachmentsRepository';
import { IQuestionAttachmentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionAttchmentsRepository';
import { INotificaticationsRepository } from '@/domain/notification/application/repositories/implementations/INotificationsRepository';

@Module({
	providers: [
		PrismaService,
		{ provide: IAnswerRepository, useClass: PrismaAnswerRepository },
		{
			provide: IQuestionRepository,
			useClass: PrismaQuestionRepository,
		},
		{
			provide: IStudentRepository,
			useClass: PrismaStudentRepository,
		},
		{ provide: IAnswerCommentsRepository, useClass: PrismaAnswerCommentsRepository },
		{ provide: IQuestionCommentsRepository, useClass: PrismaQuestionCommentsRepository },
		{ provide: IAnswerAttchmentsRepository, useClass: PrismaAnswerAttachmentsRepository },
		{ provide: IQuestionAttachmentsRepository, useClass: PrismaQestionAttachmentsRepository },
		{ provide: IAttachmentRepository, useClass: PrismaAttachmentsRepository },
		{
			provide: INotificaticationsRepository,
			useClass: PrismaNotificationsRepository,
		},
	],
	exports: [
		PrismaService,
		IAnswerRepository,
		IStudentRepository,
		IQuestionRepository,
		IAnswerCommentsRepository,
		IQuestionCommentsRepository,
		IAnswerAttchmentsRepository,
		IQuestionAttachmentsRepository,
		IAttachmentRepository,
		INotificaticationsRepository,
	],
})
export class DatabaseModule {}
