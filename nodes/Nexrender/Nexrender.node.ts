import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';
import { createClient, Job } from './Nexapi'; // Adjusted path

export class NexrenderNode implements INodeType {
	description: INodeTypeDescription = {
			displayName: 'Nexrender',
			name: 'nexrender',
			group: ['transform'],
			version: 1,
			description: 'AE Automation',
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
			properties: [
					{
							displayName: 'Nexrender Task',
							name: 'operation',
							type: 'options',
							noDataExpression: true,
							options: [
									{ name: 'Create', value: 'create', description: 'Create a job', action: 'Create a job' },
									{ name: 'Delete', value: 'delete', description: 'Delete a job', action: 'Delete a job' },
									{ name: 'Get', value: 'get', description: 'Get a job', action: 'Get a job' },
									{ name: 'Health Check', value: 'healthCheck', description: 'Check server health', action: 'Check server health' },
									{ name: 'List', value: 'list', description: 'List all jobs', action: 'List all jobs' },
									{ name: 'Update', value: 'update', description: 'Update a job', action: 'Update a job' },
							], // All options lists in n8n nodes must be alphabetized.
							default: 'create',
					},
					{
							displayName: 'Resource',
							name: 'resource',
							type: 'hidden',
							default: 'job',
							noDataExpression: true,
							displayOptions: {
									show: { operation: ['healthCheck'] },
							},
					},
					{
							displayName: 'Job UID',
							name: 'jobId',
							type: 'string',
							displayOptions: {
									show: { operation: ['get', 'update', 'delete'] },
							},
							default: '',
							required: true,
							description: 'UID of the job to retrieve, update, or delete',
					},
					{
							displayName: 'AEP Project Source',
							name: 'templateSrc',
							type: 'string',
							default: '',
							placeholder: 'file:///project.aep',
							required: true,
							description: 'Location of the Project.aep',
					},
					{
							displayName: 'Composition',
							name: 'composition',
							type: 'string',
							default: '',
							required: true,
							placeholder: 'MainComp (or... "MainComp->PreComp->PrePreComp")',
							description: 'Composition of the template being modified',
					},
					{
							displayName: 'Render Output Location',
							name: 'outputLocation',
							type: 'string',
							default: '',
							placeholder: '/folder/myrender.mov',
							description: 'The output location for your rendered file',
					},
					{
							displayName: 'Continue On Missing',
							name: 'continueOnMissing',
							type: 'boolean',
							default: false,
							description: 'Whether to continue on missing assets',
					},
					{
							displayName: 'Output Module',
							name: 'outputModule',
							type: 'string',
							default: '',
							placeholder: 'Lossless with Alpha',
							description: 'AE Output Module for the job',
					},
					{
							displayName: 'Output Extension',
							name: 'outputExt',
							type: 'string',
							default: '',
							placeholder: 'mov',
							description: 'Output file extension for the job',
					},
					{
							displayName: 'Render Settings',
							name: 'renderSettings',
							type: 'string',
							default: 'Best Settings',
							description: 'AE Render Settings for the job',
					},
					{
							displayName: 'Output Settings',
							name: 'outputSettings',
							type: 'string',
							default: '',
							placeholder: 'Comp Name',
							description: 'AE Output Settings for the job',
					},
			],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			const returnData: INodeExecutionData[] = [];

			const credentials = await this.getCredentials('nexrenderApi') as IDataObject;
			const client = createClient({
					host: credentials.serverUrl as string,
					secret: credentials.apiKey as string,
					getNode: this.getNode.bind(this), // Ensure correct context
			});

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
					const operation = this.getNodeParameter('operation', itemIndex) as string;
					let responseData: IDataObject | undefined;

					try {
							if (operation === 'create') {
									const result = await client.addJob({
											template: {
													src: this.getNodeParameter('templateSrc', itemIndex) as string,
													composition: this.getNodeParameter('composition', itemIndex) as string,
											},
											// Add more data as required
									});
									responseData = result as unknown as IDataObject;
							} else if (operation === 'update') {
									const jobId = this.getNodeParameter('jobId', itemIndex) as string;
									const updateData = {}; // Add the required data for update
									await client.updateJob(jobId, updateData);
									responseData = { success: true };
							} else if (operation === 'get') {
									const jobId = this.getNodeParameter('jobId', itemIndex) as string;
									const job: Job = await client.getJob(jobId);
									responseData = { ...job } as IDataObject;
							} else if (operation === 'list') {
									const jobs: Job[] = await client.listJobs();
									responseData = { jobs } as unknown as IDataObject;
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
