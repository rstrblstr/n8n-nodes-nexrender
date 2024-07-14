import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties
} from 'n8n-workflow';

export class NexrenderApi implements ICredentialType {
	name = 'nexrenderApi';
	displayName = 'Nexrender API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Server URL',
			name: 'serverUrl',
			type: 'string',
			default: 'http://localhost:3000',
			description: 'The URL of the Nexrender API server',
		},
		{
			displayName: 'API Secret',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: 'myapisecret',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'nexrender-secret': '={{$credentials.apiKey}}',
			},
		},
	};
}
