import { IUseCaseError } from '@/core/errors/IUseCaseError';

export class NotallowedError extends Error implements IUseCaseError {
	constructor() {
		super('Not allowed.');
	}
}
