export interface ApiResponseStrategyInterface {
	getName(): string;
	parseJSON(json: any): void;
}
