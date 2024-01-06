import { z } from 'zod';
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question-use-case';

const commentOnquestionBodySchema = z.object({
	content: z.string(),
});

type CommentOnquestionBodySchema = z.infer<typeof commentOnquestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnquestionBodySchema);

@Controller('/questions/:questionId/comments')
export class CommentOnquestionController {
	constructor(private commentOnquestion: CommentOnQuestionUseCase) {}

	@Post()
	async handle(@Body(bodyValidationPipe) body: CommentOnquestionBodySchema, @CurrentUser() user: UserPayload, @Param('questionId') questionId: string) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.commentOnquestion.execute({
			content,
			authorId: userId,
			questionId,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}
	}
}
