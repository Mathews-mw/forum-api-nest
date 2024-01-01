import { makeStudent } from '../factories/make-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { InMemoryStudentsRepository } from '../in-memory/in-memory-students-repository';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';

let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let authenticateStudentUseCase: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		authenticateStudentUseCase = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter);
	});

	test('Should be able to authenticate a stundent', async () => {
		const student = makeStudent({
			email: 'johndoe@example.com',
			password: await fakeHasher.hash('123456'),
		});

		inMemoryStudentsRepository.items.push(student);

		const result = await authenticateStudentUseCase.execute({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(result.isSucces()).toBe(true);
		expect(result.value).toEqual({ accessToken: expect.any(String) });
	});
});
