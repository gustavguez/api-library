import { ApiResponseStrategyInterface } from '../api-response-strategy.interface';

export class ApiRootResponseStrategyModel implements ApiResponseStrategyInterface{

	public getName(): string {
		return 'root';
	}

	public parseJSON(json: any): any {
		// Init data
		let data: any = null;

		// Check key data in json
		if (json) {
			data = json;
		}
		return data;
	}

}
