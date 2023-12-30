import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<Props> {
	private _id: UniqueEntityId;

	// O protected, diferente do private, é uma propriedade que pode ser acessada tanto pela própria classe e também por todas as classes que extende esse classe;
	protected props: Props;

	get id() {
		return this._id;
	}

	protected constructor(proprs: Props, id?: UniqueEntityId) {
		this.props = proprs;
		this._id = id ?? new UniqueEntityId();
	}

	public equals(entity: Entity<unknown>) {
		if (entity === this) {
			return true;
		}

		if (entity._id === this._id) {
			return true;
		}

		return false;
	}
}
