import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

interface IInstructorProps {
	name: string;
}

export class Instructor extends Entity<IInstructorProps> {
	static create(props: IInstructorProps, id?: UniqueEntityId) {
		const structor = new Instructor(props, id);

		return structor;
	}
}
