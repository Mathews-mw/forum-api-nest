import { z } from 'zod';
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';

import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case';

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.string().uuid()),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(@Body(bodyValidationPipe) body: EditQuestionBodySchema, @CurrentUser() user: UserPayload, @Param('id') questionId: string) {
		const { content, title, attachments } = body;
		const userId = user.sub;

		const result = await this.editQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds: attachments,
			questionId,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}
	}
}
