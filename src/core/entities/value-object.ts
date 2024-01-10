export abstract class ValueObject<Props> {
	protected props: Props;

	protected constructor(proprs: Props) {
		this.props = proprs;
	}

	public equals(valueObject: ValueObject<unknown>) {
		if (valueObject === null || valueObject === undefined) {
			return false;
		}

		if (valueObject.props === undefined) {
			return false;
		}

		return JSON.stringify(valueObject) === JSON.stringify(this.props);
	}
}
