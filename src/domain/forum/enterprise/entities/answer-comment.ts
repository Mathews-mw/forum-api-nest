import { Optional } from '@/core/types/optional';
import { Comment, CommentProps } from './comments';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IAnswerCommentProps extends CommentProps {
	answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<IAnswerCommentProps> {
	get answerId() {
		return this.props.answerId;
	}

	static create(props: Optional<IAnswerCommentProps, 'createdAt'>, id?: UniqueEntityId) {
		const answerComment = new AnswerComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return answerComment;
	}
}
