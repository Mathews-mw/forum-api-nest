import { z } from 'zod';
import { BadRequestException, Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common';

import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type TAuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {
	constructor(private authenticateStudentUsecase: AuthenticateStudentUseCase) {}

	@Post()
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: TAuthenticateBodySchema) {
		const { email, password } = body;

		const result = await this.authenticateStudentUsecase.execute({
			email,
			password,
		});

		if (result.isFalse()) {
			const error = result.value;

			switch (error.constructor) {
				case WrongCredentialsError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			access_token: result.value.accessToken,
		};
	}
}
