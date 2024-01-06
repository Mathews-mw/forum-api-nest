import { z } from 'zod';
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';

import { AnswerPresenter } from '../presenters/answer-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers-use-case';

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchem = z.infer<typeof pageQueryParamsSchema>;

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
	constructor(private fetchRecenteQuestionsUseCase: FetchQuestionAnswersUseCase) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchem, @Param('questionId') questionId: string) {
		const result = await this.fetchRecenteQuestionsUseCase.execute({
			page,
			questionId,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}

		const answers = result.value.answers;

		return { answers: answers.map(AnswerPresenter.toHTTP) };
	}
}
