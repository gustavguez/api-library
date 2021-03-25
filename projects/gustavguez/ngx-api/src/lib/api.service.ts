import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiDataResponseStrategyModel } from './response-strategies/api-data-response-strategy.model';
import { ApiRootResponseStrategyModel } from './response-strategies/api-root-response-strategy.model';
import { ApiHalResponseStrategyModel } from './response-strategies/api-hal-response-strategy.model';
import { ApiResponseStrategyInterface } from './api-response-strategy.interface';
import { ApiResponseModel } from './api-response.model';
import { DataUtility } from './utilities/data.utility';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	// Models
	private apiURL: string;
	private accessToken: string;

	private defaultApiResponseStrategy: ApiResponseStrategyInterface;
	private activeApiResponseStrategy: ApiResponseStrategyInterface;
	private apiResponseStrategies: ApiResponseStrategyInterface[];

	// Service constructor
	constructor(
		private httpClient: HttpClient) {
		// Load data strategy by default
		this.apiResponseStrategies = [
			new ApiRootResponseStrategyModel(),
			new ApiDataResponseStrategyModel(),
			new ApiHalResponseStrategyModel()
		];

		// Defaults
		this.apiURL = '';
		this.accessToken = '';
		this.defaultApiResponseStrategy = this.apiResponseStrategies[0];
		this.activeApiResponseStrategy = this.apiResponseStrategies[0];
	}

	// Setters
	public setApiURL(apiURL: string): void {
		this.apiURL = apiURL;
	}

	public setAccessToken(accessToken: string): void {
		this.accessToken = accessToken;
	}

	// Add strategy method
	public addApiResponseStrategy(strategy: ApiResponseStrategyInterface): void {
		if (strategy.getName()) {
			this.apiResponseStrategies.push(strategy);
		}
	}

	public setDefaultApiResponseStrategy(name: string): void {
		const strategy: ApiResponseStrategyInterface = this.findResponseStrategy(name);

		// Load as default
		if(strategy){
			this.defaultApiResponseStrategy = strategy;
		}
	}

	// Change active strategy
	public changeApiResponseStrategy(strategyName: string) {
		const strategy: ApiResponseStrategyInterface = this.findResponseStrategy(strategyName);

		// Load to active
		if(strategy){
			this.activeApiResponseStrategy = strategy;
		}
	}

	// Restore prev active stategy
	public restoreApiResponseStrategy(): void {
		// Check prev are not empty and is different
		if (this.defaultApiResponseStrategy !== undefined
			&& this.defaultApiResponseStrategy.getName() !== this.activeApiResponseStrategy.getName()) {
			this.activeApiResponseStrategy = this.defaultApiResponseStrategy;
		}
	}

	// Fetch
	public fetchData(uri: string, params?: any): Observable<ApiResponseModel> {
		// headers obj
		const headers: any = {};

		//Check access token
		if(this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`
		}

		// Get options
		const httpOptions = {
			headers: new HttpHeaders(headers),
			params: params
		};

		// Do request
		return this.httpClient
			.get(this.apiURL + uri, httpOptions)
			.pipe(
				// Map response
				map((response: any) => this.parseResponse(response))
			);
	}

	// Fetch
	public getObj(uri: string, id?: any): Observable<ApiResponseModel> {
		// headers obj
		const headers: any = {};

		//Check access token
		if(this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`
		}

		// Get options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		// Do request
		return this.httpClient
			.get(this.apiURL + uri + (id ? '/' + id : ''), httpOptions)
			.pipe(
				// Map response
				map((response: any) => this.parseResponse(response))
			);
	}

	// Update an object using PATCH
	public partialUpdateObj(uri: string, id: number, obj: any): Observable<ApiResponseModel> {
		// headers obj
		const headers: any = {};

		//Check access token
		if(this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`
		}

		// Options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		// Url
		const url: string = this.apiURL + uri + '/' + id;

		// Do request
		return this.httpClient
			.patch(url, obj, httpOptions)
			.pipe(
				// Map response
				map((response: any) => this.parseResponse(response))
			);
	}

	// Update an object using PATCH
	public partialUpdateList(uri: string, obj: any): Observable<ApiResponseModel> {
		// headers obj
		const headers: any = {};

		//Check access token
		if(this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`
		}

		// Options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		// Url
		const url: string = this.apiURL + uri;

		// Do request
		return this.httpClient
			.patch(url, obj, httpOptions)
			.pipe(
				// Map response
				map((response: any) => this.parseResponse(response))
			);
	}

	// Delete an object using DELETE
	public deleteObj(uri: string, id?: any): Observable<boolean> {
		// headers obj
		const headers: any = {};

		//Check access token
		if(this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`
		}

		// Options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		// Url
		const url: string = this.apiURL + uri + `${id ? '/' + id : ''}`;

		// Do request
		return this.httpClient
			.delete(url, httpOptions)
			.pipe(
				// Map response
				map(() => true)
			);
	}

	// Create an object with POST
	public createObj(uri: string, obj: any): Observable<ApiResponseModel> {
		// headers obj
		const headers: any = {};

		//Check access token
		if(this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`
		}

		// Options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		// Url
		const url: string = this.apiURL + uri;

		// Check form data
		if (DataUtility.needFormData(obj)) {
			obj = DataUtility.jsonToFormData(obj);
		}

		// Do request
		return this.httpClient
			.post(url, obj, httpOptions)
			.pipe(
				// Map response
				map((response: any) => this.parseResponse(response))
			);
	}

	// Update an object with PUT
	public updateObj(uri: string, id: any, obj: any): Observable<ApiResponseModel> {
		// headers obj
		const headers: any = {};

		//Check access token
		if(this.accessToken) {
			headers.Authorization = `Bearer ${this.accessToken}`
		}

		// Options
		const httpOptions = {
			headers: new HttpHeaders(headers)
		};

		// Url
		const url: string = this.apiURL + uri + `/${id}`;

		// Check form data
		if (DataUtility.needFormData(obj)) {
			obj = DataUtility.jsonToFormData(obj);
		}

		// Do request
		return this.httpClient
			.put(url, obj, httpOptions)
			.pipe(
				// Map response
				map((response: any) => this.parseResponse(response))
			);
	}

	// Create | Update an object with POST
	public saveObj(uri: string, obj: any): Observable<ApiResponseModel> { 
		if(obj.id) {
			const id: any = obj.id;
			delete obj.id;
			return this.updateObj(uri, id, obj);
		}
		return this.createObj(uri, obj);
	}

	// Parse response
	private parseResponse(response: any): ApiResponseModel {
		// Current response
		const resp: ApiResponseModel = new ApiResponseModel();

		// CHECK RESPONSE
		resp.data = this.activeApiResponseStrategy.parseJSON(response);

		// Return api response model
		return resp;
	}


	private findResponseStrategy(strategyName: string): ApiResponseStrategyInterface {
		let responseStrategy: any = null;

		// Find strategy
		this.apiResponseStrategies.every((strategy: ApiResponseStrategyInterface) => {
			// Check name
			if (strategy.getName() === strategyName) {
				// Load new stategy
				responseStrategy = strategy;
			}
			return !responseStrategy;
		});
		return responseStrategy;
	}
}
