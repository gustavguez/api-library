import { ApiResponseStrategyInterface } from '../api-response-strategy.interface';

export class ApiDataResponseStrategyModel implements ApiResponseStrategyInterface{

	public getName(): string {
		return 'data';
	}

	public parseJSON(json: any): any {
		// Init data
		let data: any = null;

		// Check key data in json
		if (json && json.data) {
			data = json.data;
		}
		return data;
	}

}
