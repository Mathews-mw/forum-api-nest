import { z } from 'zod';
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';

import { CommentPresenter } from '../presenters/comment-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchem = z.infer<typeof pageQueryParamsSchema>;

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
	constructor(private fetchRecenteQuestionsUseCase: FetchQuestionCommentsUseCase) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchem, @Param('questionId') questionId: string) {
		const result = await this.fetchRecenteQuestionsUseCase.execute({
			page,
			questionId,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}

		const questionComments = result.value.questionComments;

		return { comments: questionComments.map(CommentPresenter.toHTTP) };
	}
}
