import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NexrenderOperations, NexrenderFields } from './NexrenderDescription';

export class Nexrender implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Nexrender',
		name: 'nexrender',
		icon: 'file:nexrender.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Nexrender API',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Nexrender Task',
						value: 'NexrenderDescription',
					},
				],
				default: 'NexrenderDescription',
			},
			...NexrenderOperations,
			...NexrenderFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			let responseData;

			if (operation === 'create') {
				const body: IDataObject = {
					templateSrc: this.getNodeParameter('templateSrc', i) as string,
					composition: this.getNodeParameter('composition', i) as string,
					assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
					actions: this.getNodeParameter('actions.action', i) as IDataObject[],
				};

				responseData = await this.helpers.httpRequest({
					method: 'POST',
					url: '/jobs',
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
					method: 'PUT',
					url: `/jobs/${jobId}`,
					body,
					json: true,
				});
			} else if (operation === 'get') {
				const jobId = this.getNodeParameter('jobId', i) as string;
				responseData = await this.helpers.httpRequest({
					method: 'GET',
					url: `/jobs/${jobId}`,
					json: true,
				});
			} else if (operation === 'list') {
				responseData = await this.helpers.httpRequest({
					method: 'GET',
					url: '/jobs',
					json: true,
				});
			} else if (operation === 'delete') {
				const jobId = this.getNodeParameter('jobId', i) as string;
				responseData = await this.helpers.httpRequest({
					method: 'DELETE',
					url: `/jobs/${jobId}`,
					json: true,
				});
			} else if (operation === 'healthCheck') {
				responseData = await this.helpers.httpRequest({
					method: 'GET',
					url: '/health',
					json: true,
				});
			}

			returnData.push({ json: responseData });
		}

		return [returnData];
	}
}
