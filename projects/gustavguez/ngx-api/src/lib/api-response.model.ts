export class ApiResponseModel {

	constructor(
		public data?: any) { }

	public hasSingreResult(): boolean {
		return this.data && this.data.id;
	}

	public hasCollectionResult(): boolean {
		return (this.data instanceof Array) && !!this.data.length;
	}
}
