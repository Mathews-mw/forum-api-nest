import { FakeUploader } from 'test/storage/fake-uploader';
import { InMemoryAttachmentsRepository } from '../in-memory/in-memmory-attachments-repository';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment';
import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type-error';

let fakeUploader: FakeUploader;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase;

describe('Upload and create attachment', () => {
	beforeEach(() => {
		fakeUploader = new FakeUploader();

		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		uploadAndCreateAttachmentUseCase = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader);
	});

	test('Should be able to upload and create an attachment', async () => {
		const result = await uploadAndCreateAttachmentUseCase.execute({
			fileName: 'sample.png',
			fileType: 'image/png',
			body: Buffer.from(''),
		});

		expect(result.isSucces).toBe(true);
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.items[0],
		});
		expect(fakeUploader.uploads).toHaveLength(1);
		expect(fakeUploader.uploads[0]).toEqual(
			expect.objectContaining({
				fileName: 'sample.png',
			})
		);
	});

	test('Should not be able to upload and create an attachment with invalid file type', async () => {
		const result = await uploadAndCreateAttachmentUseCase.execute({
			fileName: 'sample.mp3',
			fileType: 'audio/mpeg',
			body: Buffer.from(''),
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
	});
});
