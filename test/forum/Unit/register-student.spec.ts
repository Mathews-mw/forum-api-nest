import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from '../in-memory/in-memory-students-repository';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';

let fakeHasher: FakeHasher;
let registerStudentUseCase: RegisterStudentUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

describe('Register Student', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		registerStudentUseCase = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
	});

	test('Should be able to register a new stundent', async () => {
		const result = await registerStudentUseCase.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(result.isSucces).toBe(true);
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0],
		});
	});

	test('Should hash student password upon registration', async () => {
		const result = await registerStudentUseCase.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		});

		const hashedPassword = fakeHasher.hash('123456');

		expect(result.isSucces).toBe(true);
		expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
	});
});
