import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { IAttachmentRepository } from '@/domain/forum/application/repositories/implementations/IAttachmentRepository';

export class InMemoryAttachmentsRepository implements IAttachmentRepository {
	public items: Attachment[] = [];

	async create(attachment: Attachment): Promise<void> {
		this.items.push(attachment);
	}
}
