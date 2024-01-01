import dayjs from 'dayjs';

import { Slug } from './value-objects/slug';
import { Optional } from '@/core/types/optional';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachmentList } from './question-attachment-list';
import { QuestBestAnswerChoseEvent } from '../events/quest-best-answer-chosen-event';

export interface QuestionProps {
	authorId: UniqueEntityId;
	bestAnswerId?: UniqueEntityId | null;
	title: string;
	slug: Slug;
	attachments: QuestionAttachmentList;
	content: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionProps> {
	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
		if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
			this.addDomainEvent(new QuestBestAnswerChoseEvent(this, bestAnswerId));
		}

		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}

	get title() {
		return this.props.title;
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);

		this.touch();
	}

	get slug() {
		return this.props.slug;
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

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments;
		this.touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isNew(): boolean {
		return dayjs().diff(this.createdAt, 'days') <= 3;
	}

	get excerpt(): string {
		return this.content.substring(0, 120).trimEnd().concat('...');
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityId) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				attachments: props.attachments ?? new QuestionAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return question;
	}
}
