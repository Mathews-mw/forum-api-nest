import { IUseCaseError } from '@/core/errors/IUseCaseError';

export class ResourceNotfounError extends Error implements IUseCaseError {
	constructor() {
		super('Resource Not Found.');
	}
}
