import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { QuestionDetailsPresenter } from '../presenters/question-details-presenter';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
	constructor(private getQuestionBySlugUseCase: GetQuestionBySlugUseCase) {}

	@Get()
	async handle(@Param('slug') slug: string) {
		const result = await this.getQuestionBySlugUseCase.execute({
			slug,
		});

		if (result.isFalse()) {
			throw new BadRequestException();
		}

		return { questions: QuestionDetailsPresenter.toHTTP(result.value.question) };
	}
}
