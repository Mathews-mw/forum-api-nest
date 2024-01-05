import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { QuestionPresenter } from '../presenters/question-presenter';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
	constructor(private fetchRecenteQuestionsUseCase: GetQuestionBySlugUseCase) {}

	@Get()
	async handle(@Param('slug') slug: string) {
		const result = await this.fetchRecenteQuestionsUseCase.execute({
			slug,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}

		return { questions: QuestionPresenter.toHTTP(result.value.question) };
	}
}
