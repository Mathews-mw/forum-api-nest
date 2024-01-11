import { z } from 'zod';
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchem = z.infer<typeof pageQueryParamsSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(private fetchRecenteAnswersUseCase: FetchAnswerCommentsUseCase) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchem, @Param('answerId') answerId: string) {
		const result = await this.fetchRecenteAnswersUseCase.execute({
			page,
			answerId,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}

		const comments = result.value.comments;

		return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
	}
}
