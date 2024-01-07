import { IUploader } from '@/domain/forum/application/storage/IUploader';
import { Module } from '@nestjs/common';
import { R2Storage } from './r2-storage';

@Module({
	providers: [{ provide: IUploader, useClass: R2Storage }],
	exports: [IUploader],
})
export class StorageModule {}
