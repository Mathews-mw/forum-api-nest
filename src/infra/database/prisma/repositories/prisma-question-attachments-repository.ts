import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';
import { IQuestionAttchmentsRepository } from '@/domain/forum/application/repositories/implementations/IQuestionAttchmentsRepository';

@Injectable()
export class PrismaQestionAttachmentsRepository implements IQuestionAttchmentsRepository {
	constructor(private prisma: PrismaService) {}

	async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		const questionAttachments = await this.prisma.attachment.findMany({
			where: {
				questionId,
			},
		});

		return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		await this.prisma.attachment.deleteMany({
			where: {
				questionId,
			},
		});
	}
}
