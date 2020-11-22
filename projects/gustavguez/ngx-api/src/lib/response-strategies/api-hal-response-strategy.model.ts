import { ApiResponseStrategyInterface } from '../api-response-strategy.interface';

export class ApiHalResponseStrategyModel implements ApiResponseStrategyInterface{

	public getName(): string {
		return 'hal';
	}

	public parseJSON(json: any): any {
		// Init data
		let data: any = null;

		// Check response
		if (json) {

			//Check single response
			if(json.id) {
				data = json;
			} else if(json._embedded){
				const key: string = Object.keys(json._embedded)[0];
				data = json._embedded[key];
			}
		}
		return data;
	}

}
