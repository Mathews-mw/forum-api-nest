import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface ICommentWithAuthorProps {
	commentId: UniqueEntityId;
	content: string;
	authorId: UniqueEntityId;
	author: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<ICommentWithAuthorProps> {
	get commentId() {
		return this.props.commentId;
	}

	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get author() {
		return this.props.author;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(props: ICommentWithAuthorProps) {
		return new CommentWithAuthor(props);
	}
}
