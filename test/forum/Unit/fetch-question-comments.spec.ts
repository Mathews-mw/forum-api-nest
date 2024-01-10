import { makeStudent } from '../factories/make-student';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionComments } from '../factories/make-question-comments';
import { InMemoryStudentsRepository } from '../in-memory/in-memory-students-repository';
import { InMemmoryQuestionCommentsRepository } from '../in-memory/in-memmory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';

let studentsRepository: InMemoryStudentsRepository;
let questionCommentsRepository: InMemmoryQuestionCommentsRepository;
let fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase;

describe('Fetch Questions Comments', () => {
	beforeEach(() => {
		questionCommentsRepository = new InMemmoryQuestionCommentsRepository(studentsRepository);
		fetchQuestionCommentsUseCase = new FetchQuestionCommentsUseCase(questionCommentsRepository);
	});

	it('Should be able to fetch question comments', async () => {
		const student = makeStudent({ name: 'John Doe' });

		studentsRepository.items.push(student);

		const comment1 = makeQuestionComments({ questionId: new UniqueEntityId('question-1'), authorId: student.id });
		const comment2 = makeQuestionComments({ questionId: new UniqueEntityId('question-1'), authorId: student.id });
		const comment3 = makeQuestionComments({ questionId: new UniqueEntityId('question-1'), authorId: student.id });

		await questionCommentsRepository.create(makeQuestionComments(comment1));
		await questionCommentsRepository.create(makeQuestionComments(comment2));
		await questionCommentsRepository.create(makeQuestionComments(comment3));

		const result = await fetchQuestionCommentsUseCase.execute({ questionId: 'question-1', page: 1 });

		expect(result.value?.comments).toHaveLength(3);
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					author: 'John Doe',
					commentId: comment1.id,
				}),
				expect.objectContaining({
					author: 'John Doe',
					commentId: comment2.id,
				}),
				expect.objectContaining({
					author: 'John Doe',
					commentId: comment3.id,
				}),
			])
		);
	});

	it('Should be able to fetch paginate questions comments', async () => {
		const student = makeStudent({ name: 'John Doe' });

		studentsRepository.items.push(student);

		for (let i = 1; i <= 22; i++) {
			await questionCommentsRepository.create(makeQuestionComments({ questionId: new UniqueEntityId('question-1'), authorId: student.id }));
		}

		const result = await fetchQuestionCommentsUseCase.execute({ questionId: 'question-1', page: 2 });

		expect(result.value?.comments).toHaveLength(2);
	});
});
