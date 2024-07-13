import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { createClient } from '@nexrender/api';

export class NxrenderNode implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'Nxrender',
			name: 'nxrender',
			group: ['transform'],
			version: 1,
			description: 'AE Automation',
			defaults: {
					name: 'Nxrender',
			},
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
					{
							name: 'nxrenderApi',
							required: true,
					},
			],
			properties: [
					{
							displayName: 'Operation',
							name: 'operation',
							type: 'options',
							noDataExpression: true,
							options: [
									{
											name: 'Create',
											value: 'create',
									},
									{
											name: 'Delete',
											value: 'delete',
									},
									{
											name: 'Get',
											value: 'get',
									},
									{
											name: 'Health Check',
											value: 'healthCheck',
									},
									{
											name: 'List',
											value: 'list',
									},
									{
											name: 'Update',
											value: 'update',
									},
							],
							default: 'create',
					},
					{
							displayName: 'Job ID',
							name: 'jobId',
							type: 'string',
							default: '',
							displayOptions: {
									show: {
											operation: ['update', 'get', 'delete'],
									},
							},
							description: 'The ID of the job to operate on',
					},
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			const returnData: INodeExecutionData[] = [];

			const credentials = await this.getCredentials('nxrenderApi');
			const client = createClient({
					host: credentials.host,
					secret: credentials.secret,
					polling: 3000, // fetch updates every 3000ms
			});

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
					const operation = this.getNodeParameter('operation', itemIndex) as string;
					let responseData: IDataObject | undefined;

					try {
							if (operation === 'create') {
									responseData = await client.addJob({
											template: {
													src: 'http://my.server.com/assets/project.aep',
													composition: 'main',
											},
									});

									responseData.on('created', job => console.log('project has been created'));
									responseData.on('started', job => console.log('project rendering started'));
									responseData.on('progress', (job, percents) => console.log('project is at: ' + percents + '%'));
									responseData.on('finished', job => console.log('project rendering finished'));
									responseData.on('error', err => console.log('project rendering error', err));
							} else if (operation === 'update') {
									const jobId = this.getNodeParameter('jobId', itemIndex) as string;
									// Implement the update logic here
							} else if (operation === 'get') {
									const jobId = this.getNodeParameter('jobId', itemIndex) as string;
									responseData = await client.getJob(jobId);
							} else if (operation === 'list') {
									responseData = await client.listJobs();
							} else if (operation === 'delete') {
									const jobId = this.getNodeParameter('jobId', itemIndex) as string;
									await client.removeJob(jobId);
									responseData = { success: true };
							} else if (operation === 'healthCheck') {
									responseData = await client.health();
							}

							if (responseData) {
									returnData.push({ json: responseData });
							}
					} catch (error) {
							if (error.response) {
									// If it's an API error, use NodeApiError
									throw new NodeApiError(this.getNode(), error);
							} else {
									// For other types of errors, use NodeOperationError
									throw new NodeOperationError(this.getNode(), error);
							}
					}
			}

			return this.prepareOutputData(returnData);
	}
}
