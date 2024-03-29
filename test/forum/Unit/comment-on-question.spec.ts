import { makeQuestion } from '../factories/make-question';
import { InMemoryQuestionRepository } from '../in-memory/in-memory-question-repository';
import { InMemmoryQuestionCommentsRepository } from '../in-memory/in-memmory-question-comments-repository';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question-use-case';
import { InMemoryQestionAttachmentsRepository } from '../in-memory/in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from '../in-memory/in-memory-students-repository';
import { InMemoryAttachmentsRepository } from '../in-memory/in-memmory-attachments-repository';

let questionRepository: InMemoryQuestionRepository;
let commentQuestionUseCase: CommentOnQuestionUseCase;
let studentsRepository: InMemoryStudentsRepository;
let attachmentRepository: InMemoryAttachmentsRepository;
let questionCommentRepository: InMemmoryQuestionCommentsRepository;
let questionAttachmentsRepository: InMemoryQestionAttachmentsRepository;

describe('Comment on Question', () => {
	beforeEach(() => {
		attachmentRepository = new InMemoryAttachmentsRepository();
		studentsRepository = new InMemoryStudentsRepository();
		questionCommentRepository = new InMemmoryQuestionCommentsRepository(studentsRepository);
		questionAttachmentsRepository = new InMemoryQestionAttachmentsRepository();
		questionRepository = new InMemoryQuestionRepository(questionAttachmentsRepository, attachmentRepository, studentsRepository);
		commentQuestionUseCase = new CommentOnQuestionUseCase(questionRepository, questionCommentRepository);
	});

	test('Should be able to comment on question', async () => {
		const question = makeQuestion();

		await questionRepository.create(question);

		await commentQuestionUseCase.execute({
			authorId: question.authorId.toString(),
			questionId: question.id.toString(),
			content: 'Comentário teste',
		});

		expect(questionCommentRepository.items[0].content).toEqual('Comentário teste');
	});
});
