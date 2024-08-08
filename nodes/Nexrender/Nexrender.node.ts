import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeApiError,
	NodeOperationError,
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
		requestDefaults: {
			baseURL: '={{$credentials.domain}}',
			url: '={{$credentials.endpoint}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'nexrender-secret': '={{$credentials.token}}',
			},
		},
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

		const credentials = await this.getCredentials('nexrenderApi');

		console.log('Fetched Credentials:', credentials); // Debugging log

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			let responseData;

			try {
				if (operation === 'create') {
					const body: IDataObject = {
						templateSrc: this.getNodeParameter('templateSrc', i) as string,
						composition: this.getNodeParameter('composition', i) as string,
						assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
						actions: this.getNodeParameter('actions.action', i) as IDataObject[],
					};

					responseData = await this.helpers.httpRequest({
						baseURL: credentials.domain,
						method: 'POST',
						url: credentials.endpoint + '/jobs',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token,
						},
						body,
						json: true,
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
						baseURL: credentials.domain,
						method: 'PUT',
						url: credentials.endpoint + `/jobs/${jobId}`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token,
						},
						body,
						json: true,
					});
				} else if (operation === 'get') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					responseData = await this.helpers.httpRequest({
						baseURL: credentials.domain,
						method: 'GET',
						url: credentials.endpoint + `/jobs/${jobId}`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token,
						},
						json: true,
					});
				} else if (operation === 'list') {
					responseData = await this.helpers.httpRequest({
						baseURL: credentials.domain,
						method: 'GET',
						url: credentials.endpoint + '/jobs',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token,
						},
						json: true,
					});
				} else if (operation === 'delete') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					responseData = await this.helpers.httpRequest({
						baseURL: credentials.domain,
						method: 'DELETE',
						url: credentials.endpoint + `/jobs/${jobId}`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token,
						},
						json: true,
					});
				} else if (operation === 'healthCheck') {
					responseData = await this.helpers.httpRequest({
						baseURL: credentials.domain,
						method: 'GET',
						url: credentials.endpoint + '/health',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token,
						},
						json: true,
					});
				}

				returnData.push({ json: responseData });
			} catch (error) {
				if (error.response) {
					throw new NodeApiError(this.getNode(), error);
				} else {
					throw new NodeOperationError(this.getNode(), error.message);
				}
			}
		}

		return [returnData];
	}
}
