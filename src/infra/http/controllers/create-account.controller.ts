import { z } from 'zod';
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';

import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error';

const createaccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

type TCreateaccountBodySchema = z.infer<typeof createaccountBodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
	constructor(private registerStudent: RegisterStudentUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createaccountBodySchema))
	async handle(@Body() body: TCreateaccountBodySchema) {
		const { name, email, password } = body;

		const result = await this.registerStudent.execute({
			name,
			email,
			password,
		});

		if (result.isFalse()) {
			const error = result.value;

			switch (error.constructor()) {
				case StudentAlreadyExistsError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}
	}
}
