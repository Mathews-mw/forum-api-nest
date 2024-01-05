import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AnswerComment, IAnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper';

export function makeAnswerComments(override: Partial<IAnswerCommentProps> = {}, id?: UniqueEntityId) {
	const answerComment = AnswerComment.create(
		{
			authorId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id
	);

	return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswer(data: Partial<IAnswerCommentProps> = {}): Promise<AnswerComment> {
		const answercomment = makeAnswerComments(data);

		await this.prisma.comment.create({
			data: PrismaAnswerCommentMapper.toPrisma(answercomment),
		});

		return answercomment;
	}
}
