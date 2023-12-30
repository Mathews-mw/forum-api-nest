import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerComments } from '../factories/make-answer-comments';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-question';
import { InMemmoryAnswerCommentsRepository } from '../in-memory/in-memmory-answer-comment-repository';

let deleteCommentAnswerUseCase: DeleteAnswerCommentUseCase;
let answerCommentRepository: InMemmoryAnswerCommentsRepository;

describe('Delete comment answer', () => {
	beforeEach(() => {
		answerCommentRepository = new InMemmoryAnswerCommentsRepository();
		deleteCommentAnswerUseCase = new DeleteAnswerCommentUseCase(answerCommentRepository);
	});

	it('Should be able to delete a answer comment', async () => {
		const answerComment = makeAnswerComments();

		await answerCommentRepository.create(answerComment);

		await deleteCommentAnswerUseCase.execute({
			answerId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		});

		expect(answerCommentRepository.items).toHaveLength(0);
	});

	it('Should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComments({
			authorId: new UniqueEntityId('author-1'),
		});

		await answerCommentRepository.create(answerComment);

		const result = await deleteCommentAnswerUseCase.execute({
			answerId: answerComment.id.toString(),
			authorId: 'Author-2',
		});

		expect(result);
	});
});
