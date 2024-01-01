import { DomainEvents } from '@/core/events/domain-events';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { IStudentRepository } from '@/domain/forum/application/repositories/implementations/IStudendtRepository';

export class InMemoryStudentsRepository implements IStudentRepository {
	public items: Student[] = [];

	async create(student: Student): Promise<void> {
		this.items.push(student);

		DomainEvents.dispatchEventsForAggregate(student.id);
	}

	async findByEmail(email: string): Promise<Student | null> {
		const student = this.items.find((student) => student.email === email);

		if (!student) {
			return null;
		}

		return student;
	}
}
