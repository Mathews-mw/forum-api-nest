import { Student } from '@/domain/forum/enterprise/entities/student';

export abstract class IStudentRepository {
	abstract create(student: Student): Promise<void>;
	abstract findByEmail(email: string): Promise<Student | null>;
}
