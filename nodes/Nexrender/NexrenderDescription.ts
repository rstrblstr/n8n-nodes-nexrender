import { INodeProperties } from 'n8n-workflow';

export const NexrenderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Create', value: 'create', description: 'Create a job' },
			{ name: 'Get', value: 'get', description: 'Get a job' },
			{ name: 'List', value: 'list', description: 'List all jobs' },
			{ name: 'Update', value: 'update', description: 'Update a job' },
			{ name: 'Delete', value: 'delete', description: 'Delete a job' },
			{ name: 'Health Check', value: 'healthCheck', description: 'Check server health' },
		],
		default: 'create',
	},
];

export const mainTab: INodeProperties[] = [
	{
		displayName: 'Nexrender Task',
		name: 'operation',
		type: 'options',
		options: [
			{ name: 'Create', value: 'create', description: 'Create a job' },
			{ name: 'Get', value: 'get', description: 'Get a job' },
			{ name: 'List', value: 'list', description: 'List all jobs' },
			{ name: 'Update', value: 'update', description: 'Update a job' },
			{ name: 'Delete', value: 'delete', description: 'Delete a job' },
			{ name: 'Health Check', value: 'healthCheck', description: 'Check server health' },
		],
		default: 'create',
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
		placeholder: 'MainComp->PreComp->PrePreComp',
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
];

export const assetsTab: INodeProperties[] = [
	{
		displayName: 'Assets',
		name: 'assets',
		type: 'fixedCollection',
		placeholder: 'Add Asset',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'asset',
				displayName: 'Asset',
				values: [
					{
						displayName: 'Source',
						name: 'src',
						type: 'string',
						default: '',
						placeholder: 'file:///image.jpg  http://image.jpg  gs://google/image.jpg  data:image/png;base64,iVBORw0KGgoAAAA...',
						description: 'Source URI of the asset (file, ftp, http, base64, gs, s3, etc...)',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Data', value: 'data' },
							{ name: 'Image', value: 'image' },
							{ name: 'Audio', value: 'audio' },
							{ name: 'Video', value: 'video' },
							{ name: 'Static', value: 'static' },
						],
						default: 'data',
						description: 'Type of the asset (Auto-determined from source URI)',
					},
					{
						displayName: 'Provider',
						name: 'provider',
						type: 'options',
						options: [
							{ name: 'File', value: 'file' },
							{ name: 'HTTP', value: 'http' },
							{ name: 'HTTPS', value: 'https' },
							{ name: 'Data', value: 'data' },
							{ name: 'Google Cloud Storage', value: 'gs' },
							{ name: 'Amazon S3', value: 's3' },
							{ name: 'FTP', value: 'ftp' },
						],
						default: 'file',
						description: 'Provider of the asset. Auto-determined from the source URL',
					},
					{
						displayName: 'Layer Name',
						name: 'layerName',
						type: 'string',
						default: '',
						placeholder: 'My_layerName',
						description: 'Specify the layer name',
					},
					{
						displayName: 'Layer Index',
						name: 'layerIndex',
						type: 'number',
						default: null,
						placeholder: '1',
						description: 'Specify the layer index. If provided, layerIndex takes precedence over layerName',
					},
					{
						displayName: 'Property',
						name: 'property',
						type: 'string',
						displayOptions: {
							show: {
								type: ['data'],
							},
						},
						default: '',
						placeholder: 'Source Text, Position, Scale, Source Text.font, Effects.name.Color',
						description: 'Property of the data asset',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						displayOptions: {
							show: {
								type: ['data'],
							},
						},
						default: '',
						description: 'Value of the data asset',
					},
					{
						displayName: 'Expression',
						name: 'expression',
						type: 'string',
						displayOptions: {
							show: {
								type: ['data'],
							},
						},
						default: '',
						description: 'Expression for the data asset',
					},
					{
						displayName: 'Large File?',
						name: 'useOriginal',
						type: 'boolean',
						displayOptions: {
							show: {
								type: ['image', 'audio', 'video'],
							},
						},
						default: false,
						description: 'Whether to forgo copying the media to the work folder',
					},
					{
						displayName: 'Cache File?',
						name: 'useCache',
						type: 'boolean',
						displayOptions: {
							show: {
								type: ['image', 'audio'],
							},
						},
						default: false,
						description: 'Whether to cache the file. Takes precedence over "Large File?"',
					},
					{
						displayName: 'Cache Path',
						name: 'cachePath',
						type: 'string',
						displayOptions: {
							show: {
								useCache: [true],
							},
						},
						default: '/${workpath}/my-nexrender-cache',
						description: 'Cache path for the asset',
					},
				],
			},
		],
	},
	{
		displayName: 'Insert Manual Assets',
		name: 'assetsOverride',
		type: 'boolean',
		default: false,
		description: 'Whether to enable manual JSON for putting assets in the job request (not recommended)',
	},
	{
		displayName: 'Manual Assets JSON',
		name: 'assetsOverrideText',
		type: 'string',
		typeOptions: {
			rows: 25,
		},
		displayOptions: {
			show: {
				assetsOverride: [true],
			},
		},
		default: '',
		required: true,
		description: 'Assets for the job (JSON format)',
	},
];

export const actionsTab: INodeProperties[] = [
	{
		displayName: 'Actions',
		name: 'actions',
		type: 'options',
		options: [
			{ name: 'Pre-download', value: 'predownload' },
			{ name: 'Post-download', value: 'postdownload' },
			{ name: 'Pre-render', value: 'prerender' },
			{ name: 'Post-render', value: 'postrender' },
		],
		default: '',
		description: 'Select a Render Action type to configure',
	},
	{
		displayName: 'Pre-Download Actions',
		name: 'predownload',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: {
				actions: ['predownload'],
			},
		},
		default: '[]',
		placeholder: '[{"Actions": "go here"}]',
		description: 'Pre-download actions (JSON format)',
	},
	{
		displayName: 'Post-Download Actions',
		name: 'postdownload',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: {
				actions: ['postdownload'],
			},
		},
		default: '[]',
		placeholder: '[{"Actions": "go here"}]',
		description: 'Post-Download actions (JSON format)',
	},
	{
		displayName: 'Pre-Render Actions',
		name: 'prerender',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: {
				actions: ['prerender'],
			},
		},
		default: '[]',
		placeholder: '[{"Actions": "go here"}]',
		description: 'Pre-Render actions (JSON format)',
	},
	{
		displayName: 'Post-Render Actions',
		name: 'postrender',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: {
				actions: ['postrender'],
			},
		},
		default: `[
            {
                "module": "@nexrender/action-upload",
                "input": "result.mp4",
                "provider": "ftp",
                "params": {
                    "host": "ftp.example.com",
                    "port": 21,
                    "user": "root",
                    "password": "pass123123",
                    "output": "/var/mystuff/output.mp4"
                }
            }
        ]`,
		description: 'Post-Render actions (JSON format)',
	},
];

export const NexrenderFields: INodeProperties[] = [
	...mainTab,
	...assetsTab,
	...actionsTab,
];
