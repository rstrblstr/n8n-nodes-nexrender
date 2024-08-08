import { INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';
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
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.domain}}',
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
		const credentials = this.getCredentials('nexrenderApi') as IDataObject;

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const jobId = this.getNodeParameter('jobId', i, '', { extractValue: true }) as string;
			const baseURL = credentials.domain as string;
			const endpoint = credentials.endpoint as string;
			let responseData;

			if (operation === 'create') {
				const payload = {
					templateSrc: this.getNodeParameter('templateSrc', i) as string,
					composition: this.getNodeParameter('composition', i) as string,
					outputLocation: this.getNodeParameter('outputopts.output.outputLocation', i) as string,
					outputModule: this.getNodeParameter('outputopts.output.outputModule', i) as string,
					outputExt: this.getNodeParameter('outputopts.output.outputExt', i) as string,
					renderSettings: this.getNodeParameter('outputopts.output.renderSettings', i) as string,
					continueOnMissing: this.getNodeParameter('continueOnMissing', i) as boolean,
					assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
					actions: this.getNodeParameter('actions.action', i) as IDataObject[],
				};

				responseData = await this.helpers.httpRequest({
					method: 'POST',
					url: `${baseURL}${endpoint}/jobs/`,
					body: payload,
					json: true,
				});
			} else if (operation === 'update') {
				const payload = {
					templateSrc: this.getNodeParameter('templateSrc', i) as string,
					composition: this.getNodeParameter('composition', i) as string,
					outputLocation: this.getNodeParameter('outputopts.output.outputLocation', i) as string,
					outputModule: this.getNodeParameter('outputopts.output.outputModule', i) as string,
					outputExt: this.getNodeParameter('outputopts.output.outputExt', i) as string,
					renderSettings: this.getNodeParameter('outputopts.output.renderSettings', i) as string,
					continueOnMissing: this.getNodeParameter('continueOnMissing', i) as boolean,
					assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
					actions: this.getNodeParameter('actions.action', i) as IDataObject[],
				};

				responseData = await this.helpers.httpRequest({
					method: 'PUT',
					url: `${baseURL}${endpoint}/jobs/${jobId}`,
					body: payload,
					json: true,
				});
			} else if (operation === 'get') {
				responseData = await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseURL}${endpoint}/jobs/${jobId}`,
					json: true,
				});
			} else if (operation === 'list') {
				responseData = await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseURL}${endpoint}/jobs`,
					json: true,
				});
			} else if (operation === 'healthCheck') {
				responseData = await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseURL}${endpoint}/health`,
					json: true,
				});
			} else if (operation === 'delete') {
				responseData = await this.helpers.httpRequest({
					method: 'DELETE',
					url: `${baseURL}${endpoint}/jobs/${jobId}`,
					json: true,
				});
			}

			returnData.push({ json: responseData });
		}

		return [returnData];
	}
}
