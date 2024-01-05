import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { QuestionComment, IQuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment';
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper';

export function makeQuestionComments(override: Partial<IQuestionCommentProps> = {}, id?: UniqueEntityId) {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id
	);

	return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestion(data: Partial<IQuestionCommentProps> = {}): Promise<QuestionComment> {
		const questioncomment = makeQuestionComments(data);

		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPrisma(questioncomment),
		});

		return questioncomment;
	}
}
