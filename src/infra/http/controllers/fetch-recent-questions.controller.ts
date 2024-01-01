import { z } from 'zod';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { QuestionPresenter } from '../presenters/question-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchem = z.infer<typeof pageQueryParamsSchema>;

@Controller('/questions')
export class FetchRecentQuestionsController {
	constructor(private fetchRecenteQuestionsUseCase: FetchRecentQuestionsUseCase) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchem) {
		const result = await this.fetchRecenteQuestionsUseCase.execute({
			page,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}

		const questions = result.value.questions;

		return { questions: questions.map(QuestionPresenter.toHTTP) };
	}
}
