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

		let credentials: IDataObject;
		try {
			credentials = await this.getCredentials('nexrenderApi') as IDataObject;
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'No credentials returned!');
		}

		const baseURL = credentials.domain as string;

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			let responseData;

			try {
				if (operation === 'create') {
					const body: IDataObject = {
						tags: this.getNodeParameter('tags', i) as string,
						priority: this.getNodeParameter('priority', i) as number,
						template: {
							src: this.getNodeParameter('templateSrc', i) as string,
							composition: this.getNodeParameter('composition', i) as string,
							frameStart: this.getNodeParameter('frameStart', i) as number,
							frameEnd: this.getNodeParameter('frameEnd', i) as number,
							continueOnMissing: this.getNodeParameter('continueOnMissing', i) as boolean,
							settingsTemplate: this.getNodeParameter('settingsTemplate', i) as string,
							outputModule: this.getNodeParameter('outputModule', i) as string,
							outputExt: this.getNodeParameter('outputExt', i) as string,
							renderSettings: this.getNodeParameter('renderSettings', i) as string,
							outputSettings: this.getNodeParameter('outputSettings', i) as string,
						},
						assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
						actions: {
							predownload: [],
							postdownload: [],
							prerender: [],
							postrender: this.getNodeParameter('actions.action', i) as IDataObject[],
						},
					};

					responseData = await this.helpers.httpRequest({
						baseURL,
						method: 'POST',
						url: `${credentials.endpoint}/jobs`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token as string,
						},
						body,
						json: true,
					});
				} else if (operation === 'update') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					const body: IDataObject = {
						tags: this.getNodeParameter('tags', i) as string,
						priority: this.getNodeParameter('priority', i) as number,
						template: {
							src: this.getNodeParameter('templateSrc', i) as string,
							composition: this.getNodeParameter('composition', i) as string,
							frameStart: this.getNodeParameter('frameStart', i) as number,
							frameEnd: this.getNodeParameter('frameEnd', i) as number,
							continueOnMissing: this.getNodeParameter('continueOnMissing', i) as boolean,
							settingsTemplate: this.getNodeParameter('settingsTemplate', i) as string,
							outputModule: this.getNodeParameter('outputModule', i) as string,
							outputExt: this.getNodeParameter('outputExt', i) as string,
							renderSettings: this.getNodeParameter('renderSettings', i) as string,
							outputSettings: this.getNodeParameter('outputSettings', i) as string,
						},
						assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
						actions: {
							predownload: [],
							postdownload: [],
							prerender: [],
							postrender: this.getNodeParameter('actions.action', i) as IDataObject[],
						},
					};

					responseData = await this.helpers.httpRequest({
						baseURL,
						method: 'PUT',
						url: `${credentials.endpoint}/jobs/${jobId}`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token as string,
						},
						body,
						json: true,
					});
				} else if (operation === 'get') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					responseData = await this.helpers.httpRequest({
						baseURL,
						method: 'GET',
						url: `${credentials.endpoint}/jobs/${jobId}`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token as string,
						},
						json: true,
					});
				} else if (operation === 'list') {
					responseData = await this.helpers.httpRequest({
						baseURL,
						method: 'GET',
						url: `${credentials.endpoint}/jobs`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token as string,
						},
						json: true,
					});
				} else if (operation === 'delete') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					responseData = await this.helpers.httpRequest({
						baseURL,
						method: 'DELETE',
						url: `${credentials.endpoint}/jobs/${jobId}`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token as string,
						},
						json: true,
					});
				} else if (operation === 'healthCheck') {
					responseData = await this.helpers.httpRequest({
						baseURL,
						method: 'GET',
						url: `${credentials.endpoint}/health`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token as string,
						},
						json: true,
					});
				}

				returnData.push({ json: responseData });
			} catch (error) {
				if (error.response) {
					throw new NodeApiError(this.getNode(), error, { message: `API Response Error: ${error.response.data}` });
				} else {
					throw new NodeApiError(this.getNode(), error, { message: `Unknown Error: ${error.message}` });
				}
			}
		}

		return [returnData];
	}
}
