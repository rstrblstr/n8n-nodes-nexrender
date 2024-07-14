import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NexrenderApi implements ICredentialType {
	name = 'nexrenderApi';
	displayName = 'Nexrender Server API';
	documentationUrl = 'https://autogfx.x.ccroww.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Secret',
			name: 'token',
			type: 'string',
			default: 'myapisecret',
			description: 'Your secret API key',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Hostname',
			name: 'domain',
			type: 'string',
			default: 'http://localhost:3000',
			description: 'The Nexrender server hostname/domain/IP address',
		},
		{
			displayName: 'Endpoint',
			name: 'endpoint',
			type: 'string',
			default: '/api/v1/',
			description: 'The Nexrender API endpoint',
		},
		{
			displayName: 'Provider & Uploader Credentials',
			name: 'providerCreds',
			type: 'fixedCollection',
			default: {},
			typeOptions: {
				multipleValues: true,
			},
			options: [
				{
					name: 'provider',
					displayName: 'Service Provider',
					values: [
						{
							displayName: 'Protocol',
							name: 'providerProtocol',
							type: 'options',
							options: [
								{ name: 'GCS', value: 'credGCS' },
								{ name: 'Other', value: 'credOther' },
								{ name: 'AWS S3', value: 'credS3' },
								{ name: 'FTP', value: 'credSFTP' },
							],
							default: 'SFTP',
							description: 'Choose a service provider',
						},
						// Fields for S3
						{
							displayName: 'Access Key ID',
							name: 's3AccessKeyId',
							type: 'string',
							typeOptions: { password: true },
							default: '',
							displayOptions: {
								show: {
									providerProtocol: ['credS3'],
								},
							},
						},
						{
							displayName: 'Secret Access Key',
							name: 's3SecretAccessKey',
							type: 'string',
							typeOptions: { password: true },
							default: '',
							displayOptions: {
								show: {
									providerProtocol: ['credS3'],
								},
							},
						},
						{
							displayName: 'Region',
							name: 's3Region',
							type: 'string',
							default: 'us-east-1',
							displayOptions: {
								show: {
									providerProtocol: ['credS3'],
								},
							},
						},
						{
							displayName: 'Bucket',
							name: 's3Bucket',
							type: 'string',
							default: '',
							displayOptions: {
								show: {
									providerProtocol: ['credS3'],
								},
							},
						},
						{
							displayName: 'ACL',
							name: 's3Acl',
							type: 'string',
							default: 'public-read',
							displayOptions: {
								show: {
									providerProtocol: ['credS3'],
								},
							},
						},
						// Fields for GCS
						{
							displayName: 'Bucket',
							name: 'gcsBucket',
							type: 'string',
							default: '',
							displayOptions: {
								show: {
									providerProtocol: ['credGCS'],
								},
							},
						},
						// Fields for SFTP
						{
							displayName: 'Host',
							name: 'sftpHost',
							type: 'string',
							default: 'localhost',
							displayOptions: {
								show: {
									providerProtocol: ['credSFTP'],
								},
							},
						},
						{
							displayName: 'Port',
							name: 'sftpPort',
							type: 'number',
							default: 21,
							displayOptions: {
								show: {
									providerProtocol: ['credSFTP'],
								},
							},
						},
						{
							displayName: 'SSL Encryption',
							name: 'sftpSSL',
							type: 'boolean',
							default: true,
							displayOptions: {
								show: {
									providerProtocol: ['credSFTP'],
								},
							},
						},
						{
							displayName: 'User',
							name: 'sftpUser',
							type: 'string',
							default: 'anonymous',
							displayOptions: {
								show: {
									providerProtocol: ['credSFTP'],
								},
							},
						},
						{
							displayName: 'Password',
							name: 'sftpPassword',
							type: 'string',
							typeOptions: { password: true },
							default: 'anonymous@',
							displayOptions: {
								show: {
									providerProtocol: ['credSFTP'],
								},
							},
						},
						// Fields for Other
						{
							displayName: 'Host',
							name: 'otherHost',
							type: 'string',
							default: 'localhost',
							displayOptions: {
								show: {
									providerProtocol: ['credOther'],
								},
							},
						},
						{
							displayName: 'Port',
							name: 'otherPort',
							type: 'number',
							default: null,
							displayOptions: {
								show: {
									providerProtocol: ['credOther'],
								},
							},
						},
						{
							displayName: 'User',
							name: 'otherUser',
							type: 'string',
							default: 'anonymous',
							displayOptions: {
								show: {
									providerProtocol: ['credOther'],
								},
							},
						},
						{
							displayName: 'Password',
							name: 'otherPassword',
							type: 'string',
							typeOptions: { password: true },
							default: 'anonymous@',
							displayOptions: {
								show: {
									providerProtocol: ['credOther'],
								},
							},
						},
					],
				},
			],
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Content-Type': 'application/json',
				'nexrender-secret': '={{$credentials.token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.domain}}',
			url: '={{$credentials.endpoint}}jobs/',
		},
	};
}

