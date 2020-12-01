export interface JSONModelInterface {
	id: any;
	fromJSON(json: any): void;
	getReference(): string;
}
