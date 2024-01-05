import { z } from 'zod';
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question-use-case';

const answerQuestionBodySchema = z.object({
	content: z.string(),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

	@Post()
	async handle(@Body(bodyValidationPipe) body: AnswerQuestionBodySchema, @CurrentUser() user: UserPayload, @Param('questionId') questionId: string) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.answerQuestion.execute({
			content,
			authorId: userId,
			questionId,
			attachmentsIds: [],
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}
	}
}
