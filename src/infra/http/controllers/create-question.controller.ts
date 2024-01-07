import { z } from 'zod';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	async handle(@Body(bodyValidationPipe) body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
		const { content, title, attachments } = body;
		const userId = user.sub;

		const result = await this.createQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds: attachments,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}
	}
}
