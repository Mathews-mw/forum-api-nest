import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IQuestionAttachmentProps, QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export function makeQuestionAttachment(override: Partial<IQuestionAttachmentProps> = {}, id?: UniqueEntityId) {
	const questionAttachment = QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id
	);

	return questionAttachment;
}

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionAttachment(data: Partial<IQuestionAttachmentProps> = {}): Promise<QuestionAttachment> {
		const questionAttachment = makeQuestionAttachment(data);

		await this.prisma.attachment.update({
			data: {
				questionId: questionAttachment.questionId.toString(),
			},
			where: {
				id: questionAttachment.attachmentId.toString(),
			},
		});

		return questionAttachment;
	}
}
