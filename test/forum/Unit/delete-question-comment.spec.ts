import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionComments } from '../factories/make-question-comments';
import { InMemmoryQuestionCommentsRepository } from '../in-memory/in-memmory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';

let deleteCommentQuestionUseCase: DeleteQuestionCommentUseCase;
let questionCommentRepository: InMemmoryQuestionCommentsRepository;

describe('Delete comment question', () => {
	beforeEach(() => {
		questionCommentRepository = new InMemmoryQuestionCommentsRepository();
		deleteCommentQuestionUseCase = new DeleteQuestionCommentUseCase(questionCommentRepository);
	});

	it('Should be able to delete a question comment', async () => {
		const questionComment = makeQuestionComments();

		await questionCommentRepository.create(questionComment);

		await deleteCommentQuestionUseCase.execute({
			questionId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		});

		expect(questionCommentRepository.items).toHaveLength(0);
	});

	it('Should not be able to delete another user question comment', async () => {
		const questionComment = makeQuestionComments({
			authorId: new UniqueEntityId('author-1'),
		});

		await questionCommentRepository.create(questionComment);

		expect(() => {
			return deleteCommentQuestionUseCase.execute({
				questionId: questionComment.id.toString(),
				authorId: 'Author-2',
			});
		}).rejects.toBeInstanceOf(Error);
	});
});
