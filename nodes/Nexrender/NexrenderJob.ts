import { INodeProperties } from 'n8n-workflow';

export const NexrenderOperations: INodeProperties[] = [
	{
		displayName: 'Choose Your Nexrender Task',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Create', value: 'create', description: 'Create a job', action: 'Create a job' },
			{ name: 'Delete', value: 'delete', description: 'Delete a job', action: 'Delete a job' },
			{ name: 'Get', value: 'get', description: 'Get a job', action: 'Get job info' },
			{ name: 'Health Check', value: 'healthCheck', description: 'Check server status', action: 'Check server status' },
			{ name: 'List', value: 'list', description: 'List all jobs', action: 'List all jobs' },
			{ name: 'Update', value: 'update', description: 'Update a job', action: 'Update a job' },
		],
		default: 'create',
	},
];

export const mainTab: INodeProperties[] = [
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
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: '',
		required: true,
		placeholder: 'file:///project.aep',
		description: 'Location of the Project.aep',
	},
	{
		displayName: 'Composition',
		name: 'composition',
		type: 'string',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: '',
		required: true,
		placeholder: 'MainComp->PreComp->PrePreComp',
		description: 'Composition of the template being modified',
	},
	{
		displayName: 'Continue On Missing',
		name: 'continueOnMissing',
		type: 'boolean',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: false,
		description: 'Whether to continue on missing assets',
	},
	{
		displayName: 'Workfolder Render Output Path',
		name: 'outputLocation',
		type: 'string',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: '',
		placeholder: '/folder/myrender.mov',
		description: 'The workfolder output location for your rendered temp file',
	},
	{
		displayName: 'Keep Renders After Finish',
		name: 'keepRender',
		type: 'boolean',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: true,
		description: 'Whether to keep final renders after finish',
	},
	{
		displayName: 'Use Job UID As Final Render Filename',
		name: 'useJobId',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				keepRender: [true],
			},
		},
		default: true,
		description: 'Whether to keep the final render (optional if you want to immediately process/upload the Output Render in other ways)',
	},
	{
		displayName: 'Copy Final Render To (Folder)',
		name: 'copyLocationFolder',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				useJobId: [true],
				keepRender: [true],
			},
		},
		default: '/render/',
		placeholder: '/full/path/to/folder/',
		description: 'The permanent output folder path to copy your render to',
	},
	{
		displayName: 'Copy Final Render To (File)',
		name: 'copyLocationFile',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				useJobId: [false],
				keepRender: [true],
			},
		},
		default: '/render/finalrender.mov',
		placeholder: '/full/path/to/finalrender.mov',
		description: 'The permanent output file path to copy your render to',
	},
	{
		displayName: 'Output Module',
		name: 'outputModule',
		type: 'string',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: 'Lossless with Alpha',
		description: 'AE Output Module for the job',
	},
	{
		displayName: 'Output Extension',
		name: 'outputExt',
		type: 'string',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: 'mov',
		description: 'Output file extension for the job',
	},
	{
		displayName: 'Render Settings',
		name: 'renderSettings',
		type: 'string',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: 'Best Settings',
		description: 'AE Render Settings for the job',
	},
	{
		displayName: 'Starting Frame Number',
		name: 'frameStart',
		type: 'number',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: 0,
		description: 'Frame number to start rendering on',
	},
	{
		displayName: 'Ending Frame Number',
		name: 'frameEnd',
		type: 'number',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: undefined,
		description: 'Frame number to end rendering on',
	},
	{
		displayName: 'Image Sequence',
		name: 'imageSequence',
		type: 'boolean',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: false,
		description: 'Whether you rendering an image sequence',
	},
	{
		displayName: 'Render Priority',
		name: 'priority',
		type: 'number',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: 5,
		description: 'Job render priority (lower number is higher priority)',
	},
	{
		displayName: 'Job Tags',
		name: 'tags',
		type: 'string',
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		default: '',
		description: 'Job categorization tags',
	},
];

export const assetsTab: INodeProperties[] = [
	{
		displayName: 'Assets',
		name: 'assets',
		type: 'fixedCollection',
		placeholder: 'Add Asset',
		default: {},
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'asset',
				displayName: 'Asset',
				values: [
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
						description: 'Type of the asset',
					},
					{
						displayName: 'Source',
						name: 'src',
						type: 'string',
						default: '',
						displayOptions: {
							show: { type: ['audio', 'image', 'static', 'video'] },
						},
						placeholder: 'file:///img.jpg http://img.jpg gs://image/img.jpg data:image/png;base64,iVBORw0KGgoAAAA...',
						description: 'Source URI of the asset (file, ftp, http, base64, gs, s3, etc...)',
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
							{ name: 'Google Cloud', value: 'gs' },
							{ name: 'HTTP', value: 'http' },
							{ name: 'HTTPS', value: 'https' },
						],
						displayOptions: {
							show: { type: ['audio', 'image', 'static', 'video'] },
						},
						default: 'file',
						description: 'Provider of the asset',
					},
					{
						displayName: 'Layer ID',
						name: 'layerid',
						type: 'options',
						options: [
							{ name: 'Layer Name', value: 'nameid' },
							{ name: 'LayerIndex', value: 'indexid' },
						],
						default: 'nameid',
						description: 'The Layer to be changed',
					},
					{
						displayName: 'Layer Name',
						name: 'layerName',
						type: 'string',
						displayOptions: {
							show: { layerid: ['nameid'] },
						},
						default: '',
						placeholder: 'My_layerName',
						description: 'Specify the layer name',
					},
					{
						displayName: 'Layer Index',
						name: 'layerIndex',
						type: 'number',
						displayOptions: {
							show: { layerid: ['indexid'] },
						},
						default: undefined,
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
								type: ['image', 'audio', 'video', 'static'],
								useOriginal: [false],
							},
						},
						default: false,
						description: 'Whether to cache the file',
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
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
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
		displayOptions: {
			show: { operation: ['create', 'update'] },
		},
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
							rows: 5,
						},
						default: '[]',
						placeholder: '[{"Actions": "go here"}]',
						description: 'Action details (JSON format)',
						displayOptions: {
							show: {
								actionType: ['predownload', 'postdownload', 'prerender'],
							},
						},
					},
					{
						displayName: 'Action JSON',
						name: 'actionJson',
						type: 'string',
						typeOptions: {
							rows: 10,
						},
						default: `
[
{
"module": "@nexrender/action-copy",
"output": "{{ $parameter['copyLocation'] }}",
"useJobId": "{{ $parameter['useJobId'] }}"
},
{
"module": "@nexrender/action-encode",
"preset": "mp4",
"output": "encoded.mp4"
},
{
"module": "@nexrender/action-copy",
"input": "encoded.mp4",
"output": "d:/mydocuments/results/myresult.mp4"
},
{
"module": "@nexrender/nexrender-action-webhook",
"url": "http://example.com/webhook",
"method": "POST",
"headers": {
"Content-Type": "application/json",
"WebhookSecret": "{{ $credentials.webhooktoken }}"
    },
    "json": {
    "uid": "{job.uid}",
    "state": "{job.state}",
    "type": "{job.type}",
    "tags": "{job.tags}",
    "renderProgress": "{job.renderProgress}",
    "createdAt": "{job.createdAt}",
    "updatedAt": "{job.updatedAt}",
    "startedAt": "{job.startedAt}",
    "jobCreator": "{job.jobCreator}",
    "jobExecutor": "{job.jobExecutor}"
    }
}
]`,
						placeholder: '[{"Actions": "go here"}]',
						description: 'Action details (JSON format)',
						displayOptions: {
							show: {
								actionType: ['postrender'],
							},
						},
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
