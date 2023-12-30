import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository';
import { PrismaQuestionRepository } from './prisma/repositories/prisma-question-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comment-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository';
import { PrismaQestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';

@Module({
	providers: [
		PrismaService,
		PrismaAnswerRepository,
		PrismaQuestionRepository,
		PrismaAnswerCommentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaAnswerAttachmentsRepository,
		PrismaQestionAttachmentsRepository,
	],
	exports: [
		PrismaService,
		PrismaAnswerRepository,
		PrismaQuestionRepository,
		PrismaAnswerCommentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaAnswerAttachmentsRepository,
		PrismaQestionAttachmentsRepository,
	],
})
export class DatabaseModule {}
