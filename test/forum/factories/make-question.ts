import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { Question, IQuestionProps } from '@/domain/forum/enterprise/entities/question';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';

export function makeQuestion(override: Partial<IQuestionProps> = {}, id?: UniqueEntityId) {
	const question = Question.create(
		{
			authorId: new UniqueEntityId(),
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			slug: Slug.create('example-question'),
			...override,
		},
		id
	);

	return question;
}

@Injectable()
export class QuestionFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestion(data: Partial<IQuestionProps> = {}): Promise<Question> {
		const question = makeQuestion(data);

		await this.prisma.question.create({
			data: PrismaQuestionMapper.toPrisma(question),
		});

		return question;
	}
}
