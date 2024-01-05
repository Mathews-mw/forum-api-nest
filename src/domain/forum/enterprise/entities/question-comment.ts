import { Optional } from '@/core/types/optional';
import { Comment, CommentProps } from './comments';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IQuestionCommentProps extends CommentProps {
	questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<IQuestionCommentProps> {
	get questionId() {
		return this.props.questionId;
	}

	static create(props: Optional<IQuestionCommentProps, 'createdAt'>, id?: UniqueEntityId) {
		const questionComment = new QuestionComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return questionComment;
	}
}
