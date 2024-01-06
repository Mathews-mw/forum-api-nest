import { z } from 'zod';
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer-use-case';

const editAnswerBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

@Controller('/answers/:id')
export class EditAnswerController {
	constructor(private editAnswer: EditAnswerUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(@Body(bodyValidationPipe) body: EditAnswerBodySchema, @CurrentUser() user: UserPayload, @Param('id') answerId: string) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.editAnswer.execute({
			content,
			answerId,
			authorId: userId,
			attachmentsIds: [],
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}
	}
}
