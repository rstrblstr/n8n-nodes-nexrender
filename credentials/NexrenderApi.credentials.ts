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
			displayName: 'Hostname',
			name: 'domain',
			type: 'string',
			default: 'http://localhost:3000',
			required: true,
			description: 'The Nexrender server hostname/domain/IP address',
		},
		{
			displayName: 'Endpoint',
			name: 'endpoint',
			type: 'string',
			default: '/api/v1',
			required: true,
			description: 'The Nexrender API endpoint',
		},
		{
			displayName: 'API Secret',
			name: 'token',
			type: 'string',
			default: 'myapisecret',
			description: 'Your secret API key (Default: myapisecret)',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Service Provider',
			name: 'provider',
			type: 'options',
			options: [
				{ name: 'None', value: 'credNone' },
				{ name: 'S3', value: 'credS3' },
				{ name: 'FTP', value: 'credFTP' },
				{ name: 'SFTP', value: 'credSFTP' },
				{ name: 'GCS', value: 'credGCS' },
				{ name: 'Other', value: 'credOther' },
			],
			default: 'credNone',
			description: 'Choose an upload service provider',
		},
		// Fields for S3
		{
			displayName: 'S3 Access Key ID',
			name: 's3AccessKeyId',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					provider: ['credS3'],
				},
			},
		},
		{
			displayName: 'S3 Secret Access Key',
			name: 's3SecretAccessKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					provider: ['credS3'],
				},
			},
		},
		{
			displayName: 'S3 Region',
			name: 's3Region',
			type: 'string',
			default: 'us-east-1',
			displayOptions: {
				show: {
					provider: ['credS3'],
				},
			},
		},
		{
			displayName: 'S3 Bucket',
			name: 's3Bucket',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					provider: ['credS3'],
				},
			},
		},
		{
			displayName: 'S3 ACL',
			name: 's3Acl',
			type: 'string',
			default: 'public-read',
			displayOptions: {
				show: {
					provider: ['credS3'],
				},
			},
		},
		// Fields for GCS
		{
			displayName: 'GCS Bucket',
			name: 'gcsBucket',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					provider: ['credGCS'],
				},
			},
		},
		// Fields for SFTP
		{
			displayName: 'SFTP Host',
			name: 'sftpHost',
			type: 'string',
			default: 'localhost',
			displayOptions: {
				show: {
					provider: ['credSFTP'],
				},
			},
		},
		{
			displayName: 'SFTP Port',
			name: 'sftpPort',
			type: 'number',
			default: 22,
			displayOptions: {
				show: {
					provider: ['credSFTP'],
				},
			},
		},
		{
			displayName: 'SFTP SSL Encryption',
			name: 'sftpSSL',
			type: 'boolean',
			default: true,
			displayOptions: {
				show: {
					provider: ['credSFTP'],
				},
			},
		},
		{
			displayName: 'SFTP User',
			name: 'sftpUser',
			type: 'string',
			default: 'anonymous',
			displayOptions: {
				show: {
					provider: ['credSFTP'],
				},
			},
		},
		{
			displayName: 'SFTP Password',
			name: 'sftpPassword',
			type: 'string',
			typeOptions: { password: true },
			default: 'anonymous@',
			displayOptions: {
				show: {
					provider: ['credSFTP'],
				},
			},
		},
		// Fields for FTP
		{
			displayName: 'FTP Host',
			name: 'ftpHost',
			type: 'string',
			default: 'localhost',
			displayOptions: {
				show: {
					provider: ['credFTP'],
				},
			},
		},
		{
			displayName: 'FTP Port',
			name: 'ftpPort',
			type: 'number',
			default: 21,
			displayOptions: {
				show: {
					provider: ['credFTP'],
				},
			},
		},
		{
			displayName: 'FTP User',
			name: 'ftpUser',
			type: 'string',
			default: 'anonymous',
			displayOptions: {
				show: {
					provider: ['credFTP'],
				},
			},
		},
		{
			displayName: 'FTP Password',
			name: 'ftpPassword',
			type: 'string',
			typeOptions: { password: true },
			default: 'anonymous@',
			displayOptions: {
				show: {
					provider: ['credFTP'],
				},
			},
		},
		// Fields for Other
		{
			displayName: 'Other Host',
			name: 'otherHost',
			type: 'string',
			default: 'localhost',
			displayOptions: {
				show: {
					provider: ['credOther'],
				},
			},
		},
		{
			displayName: 'Other Port',
			name: 'otherPort',
			type: 'number',
			default: null,
			displayOptions: {
				show: {
					provider: ['credOther'],
				},
			},
		},
		{
			displayName: 'Other User',
			name: 'otherUser',
			type: 'string',
			default: 'anonymous',
			displayOptions: {
				show: {
					provider: ['credOther'],
				},
			},
		},
		{
			displayName: 'Other Password',
			name: 'otherPassword',
			type: 'string',
			typeOptions: { password: true },
			default: 'anonymous@',
			displayOptions: {
				show: {
					provider: ['credOther'],
				},
			},
		},
		{
			displayName: 'Post-Render Webhook Token',
			name: 'webhooktoken',
			type: 'string',
			typeOptions: { password: true },
			default: 'mywebhooktoken',
			description: 'Your secret webhook authentication token (default: mywebhooktoken)',
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
			url: '={{$credentials.endpoint}}/health',
		},
	};
}
