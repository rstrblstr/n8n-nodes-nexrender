import { INodeProperties } from 'n8n-workflow';

export const NexrenderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
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
		],
		default: 'create',
	},
];

export const mainTab: INodeProperties[] = [
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
							{ name: 'Audio', value: 'audio' },
							{ name: 'Data', value: 'data' },
							{ name: 'Image', value: 'image' },
							{ name: 'Static', value: 'static' },
							{ name: 'Video', value: 'video' },
						],
						default: 'data',
						description: 'Type of the asset (Auto-determined from source URI)',
					},
					{
						displayName: 'Provider',
						name: 'provider',
						type: 'options',
						options: [
							{ name: 'Amazon S3', value: 's3' },
							{ name: 'Data', value: 'data' },
							{ name: 'File', value: 'file' },
							{ name: 'FTP', value: 'ftp' },
							{ name: 'Google Cloud Storage', value: 'gs' },
							{ name: 'HTTP', value: 'http' },
							{ name: 'HTTPS', value: 'https' },
						],
						default: 'file',
						description: 'Provider of the asset. Auto-determined from the source URL.',
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
						description: 'Specify the layer index. If provided, layerIndex takes precedence over layerName.',
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
						description: 'Whether to cache the file. Takes precedence over "Large File?".',
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
		type: 'fixedCollection',
		placeholder: 'Add Action',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'action',
				displayName: 'Action',
				values: [
					{
						displayName: 'Action Type',
						name: 'actionType',
						type: 'options',
						options: [
							{ name: 'Pre-Download', value: 'predownload' },
							{ name: 'Post-Download', value: 'postdownload' },
							{ name: 'Pre-Render', value: 'prerender' },
							{ name: 'Post-Render', value: 'postrender' },
						],
						default: 'predownload',
						description: 'Select a Render Action type to configure',
					},
					{
						displayName: 'Action JSON',
						name: 'actionJson',
						type: 'string',
						typeOptions: {
							rows: 10,
						},
						default: '[]',
						placeholder: '[{"Actions": "go here"}]',
						description: 'Action details (JSON format)',
					},
				],
			},
		],
	},
];

export const NexrenderFields: INodeProperties[] = [
	...mainTab,
	...assetsTab,
	...actionsTab,
];
