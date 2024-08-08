import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NexrenderOperations, NexrenderFields } from './NexrenderJob';

export class Nexrender implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AutoGfx',
		name: 'nexrender',
		icon: 'file:nexrender.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Execute Nexrender API Requests',
		defaults: {
			name: 'Nexrender',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'nexrenderApi',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Nexrender Tasks',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Nexrender Task',
						value: 'NexrenderJob',
					},
				],
				default: 'NexrenderJob',
			},
			...NexrenderOperations,
			...NexrenderFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('nexrenderApi') as IDataObject;

		if (!credentials) {
			throw new Error('No credentials returned!');
		}

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			const requestOptions: IDataObject = {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'nexrender-secret': credentials.token,
				},
				baseURL: credentials.domain,
				url: credentials.endpoint,
				json: true,
			};

			let responseData;

			if (operation === 'create') {
				const body: IDataObject = {
					templateSrc: this.getNodeParameter('templateSrc', i) as string,
					composition: this.getNodeParameter('composition', i) as string,
					assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
					actions: this.getNodeParameter('actions.action', i) as IDataObject[],
				};

				responseData = await this.helpers.httpRequest({
					...requestOptions,
					method: 'POST',
					url: `${requestOptions.baseURL}${requestOptions.url}/jobs`,
					body,
				});
			} else if (operation === 'update') {
				const jobId = this.getNodeParameter('jobId', i) as string;
				const body: IDataObject = {
					templateSrc: this.getNodeParameter('templateSrc', i) as string,
					composition: this.getNodeParameter('composition', i) as string,
					assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
					actions: this.getNodeParameter('actions.action', i) as IDataObject[],
				};

				responseData = await this.helpers.httpRequest({
					...requestOptions,
					method: 'PUT',
					url: `${requestOptions.baseURL}${requestOptions.url}/jobs/${jobId}`,
					body,
				});
			} else if (operation === 'get') {
				const jobId = this.getNodeParameter('jobId', i) as string;
				responseData = await this.helpers.httpRequest({
					...requestOptions,
					method: 'GET',
					url: `${requestOptions.baseURL}${requestOptions.url}/jobs/${jobId}`,
				});
			} else if (operation === 'list') {
				responseData = await this.helpers.httpRequest({
					...requestOptions,
					method: 'GET',
					url: `${requestOptions.baseURL}${requestOptions.url}/jobs`,
				});
			} else if (operation === 'delete') {
				const jobId = this.getNodeParameter('jobId', i) as string;
				responseData = await this.helpers.httpRequest({
					...requestOptions,
					method: 'DELETE',
					url: `${requestOptions.baseURL}${requestOptions.url}/jobs/${jobId}`,
				});
			} else if (operation === 'healthCheck') {
				responseData = await this.helpers.httpRequest({
					...requestOptions,
					method: 'GET',
					url: `${requestOptions.baseURL}${requestOptions.url}/health`,
				});
			}

			returnData.push({ json: responseData });
		}

		return [returnData];
	}
}
