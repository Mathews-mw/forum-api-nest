import { z } from 'zod';
import { hash } from 'bcryptjs';
import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';

import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const createaccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

type TCreateaccountBodySchema = z.infer<typeof createaccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
	constructor(private prisma: PrismaService) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createaccountBodySchema))
	async handle(@Body() body: TCreateaccountBodySchema) {
		const { name, email, password } = body;

		const userWithSameEmail = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (userWithSameEmail) {
			throw new ConflictException('User with same e-mail address already exists.');
		}

		const hashedPassword = await hash(password, 8);

		await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	}
}
