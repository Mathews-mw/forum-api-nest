import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IAnswerAttachmentProps, AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export function makeAnswerAttachment(override: Partial<IAnswerAttachmentProps> = {}, id?: UniqueEntityId) {
	const answerAttachment = AnswerAttachment.create(
		{
			answerId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id
	);

	return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswerAttachment(data: Partial<IAnswerAttachmentProps> = {}): Promise<AnswerAttachment> {
		const answerAttachment = makeAnswerAttachment(data);

		await this.prisma.attachment.update({
			data: {
				answerId: answerAttachment.answerId.toString(),
			},
			where: {
				id: answerAttachment.attachmentId.toString(),
			},
		});

		return answerAttachment;
	}
}
