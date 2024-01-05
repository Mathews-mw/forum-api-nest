import { Optional } from '@/core/types/optional';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { AnswerAttachmentList } from './answer-attachments-list';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerCreatedEvent } from '../events/answer-created-event';

export interface IAnswerProps {
	authorId: UniqueEntityId;
	questionId: UniqueEntityId;
	content: string;
	attachments: AnswerAttachmentList;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Answer extends AggregateRoot<IAnswerProps> {
	get authorId() {
		return this.props.authorId;
	}

	get questionId() {
		return this.props.questionId;
	}

	get content() {
		return this.props.content;
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	get attachments() {
		return this.props.attachments;
	}

	set attachments(attachments: AnswerAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get excerpt(): string {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IAnswerProps, 'createdAt' | 'attachments'>, id?: UniqueEntityId) {
		const answer = new Answer(
			{
				...props,
				attachments: props.attachments ?? new AnswerAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		const isNewAnswer = !id;

		// O evento só será disparado para novas answer criadas, ou seja, que não possuam um ID.
		if (isNewAnswer) {
			answer.addDomainEvent(new AnswerCreatedEvent(answer));
		}

		return answer;
	}
}
