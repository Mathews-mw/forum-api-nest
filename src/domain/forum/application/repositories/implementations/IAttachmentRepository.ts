import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export abstract class IAttachmentRepository {
	abstract create(attachment: Attachment): Promise<void>;
}
