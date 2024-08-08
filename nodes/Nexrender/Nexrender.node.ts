import { INodeType, INodeTypeDescription } from 'n8n-workflow';
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
			baseURL: 'http://localhost:3000',
			url: '/api/v1/',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
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
}
