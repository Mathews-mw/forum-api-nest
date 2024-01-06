import { z } from 'zod';
import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-anwer-use-case';

const commentOnanswerBodySchema = z.object({
	content: z.string(),
});

type CommentOnanswerBodySchema = z.infer<typeof commentOnanswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnanswerBodySchema);

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
	constructor(private commentOnanswer: CommentOnAnswerUseCase) {}

	@Post()
	async handle(@Body(bodyValidationPipe) body: CommentOnanswerBodySchema, @CurrentUser() user: UserPayload, @Param('answerId') answerId: string) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.commentOnanswer.execute({
			content,
			authorId: userId,
			answerId,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}
	}
}
