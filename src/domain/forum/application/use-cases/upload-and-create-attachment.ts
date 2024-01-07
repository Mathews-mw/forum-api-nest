import { Injectable } from '@nestjs/common';

import { IUploader } from '../storage/IUploader';
import { Either, failure, success } from '@/core/either';
import { Attachment } from '../../enterprise/entities/attachment';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';
import { IAttachmentRepository } from '../repositories/implementations/IAttachmentRepository';

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string;
	fileType: string;
	body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	InvalidAttachmentTypeError,
	{
		attachment: Attachment;
	}
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private attachmentRepository: IAttachmentRepository,
		private uploader: IUploader
	) {}

	async execute({ fileName, fileType, body }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		const fileTypeValidador = /^(image\/(jpeg|png))$|^application\/pdf$/;

		if (!fileTypeValidador.test(fileType)) {
			return failure(new InvalidAttachmentTypeError(fileType));
		}

		const { url } = await this.uploader.upload({
			fileName,
			fileType,
			body,
		});

		const attachment = Attachment.create({
			title: fileName,
			url,
		});

		await this.attachmentRepository.create(attachment);

		return success({
			attachment,
		});
	}
}
