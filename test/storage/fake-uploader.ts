import { randomUUID } from 'node:crypto';

import { IUploadParams, IUploader } from '@/domain/forum/application/storage/IUploader';

interface IUpload {
	fileName: string;
	url: string;
}

export class FakeUploader implements IUploader {
	public uploads: IUpload[] = [];

	async upload({ fileName }: IUploadParams): Promise<{ url: string }> {
		const url = randomUUID();

		this.uploads.push({
			fileName,
			url,
		});

		return { url };
	}
}
