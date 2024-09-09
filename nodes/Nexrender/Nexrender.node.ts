
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


	// the new promise code:
let jobId = NexrenderFields.jobId || '';

const nexrenderHost = 'http://localhost:33055';
const nexrenderSecret = 'myapisecret';

const websitePort = "48080";
const websiteUrl = "autogfx.ccroww.com";

const pRetry = require('p-retry');
const fetch = require('node-fetch');

const { createClient } = require('./vendor/@nexrender/api'); // Update to use your local copy in 'vendor'

// Create a client for communicating with the nexrender server
const client = createClient({
    host: nexrenderHost, // Replace with actual host
    secret: nexrenderSecret,
});

module.exports = {
    async execute() {
        try {
            // Add a new job to nexrender
            const job = await client.addJob({
                template: {
                    src: 'file:///assets/project.aep',
                    composition: 'main',
                },
            });

            // Event listeners for Nexrender job events
            job.on('created', (job) => {
                console.log('Job created:', job);
                this.updateLiveVariable(jobId, 'jobStatus', 'Job Created'); // Update live variable
            });

            job.on('started', (job) => {
                console.log('Job started:', job);
                this.updateLiveVariable(jobId, 'jobStatus', 'Job Started');
            });

            job.on('progress', (job, percents) => {
                console.log(`Rendering progress: ${percents}%`);
                this.updateLiveVariable(jobId, 'jobProgress', percents);
            });

            job.on('finished', (job) => {
                console.log('Job finished:', job);
                this.updateLiveVariable(jobId, 'jobStatus', 'Job Finished');
            });

            job.on('error', (err) => {
                console.error('Rendering error:', err);
                this.updateLiveVariable(jobId, 'jobError', err.message);
            });

        } catch (error) {
            console.error('Error:', jobId, error);
        }
    },

    // Custom method to update a live variable
    updateLiveVariable(variableName, value) {
        // Implementation depends on how you're exposing this to the website
        console.log(`Updating ${variableName}: ${value}`);
        // You could use websockets, an API, or a database to store these updates
    }
};

//  QUESTION FOR GPT:
// This will now trigger messages to go to the website instead of this n8n node.  Where does this code go? Does it go in the node.js application that is sending the messages, does it go here in the n8n node that is telling that node.js applciation to connect to the website frontend on another machine, or does it go on the website?
//websocket reply listener:

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: websitePort });

wss.on('connection', ws => {
    console.log('Client connected');
		ws.send(JSON.stringify({ status: 'connected' }));

		job.on('created', (job) => {
                console.log('job created:', job);
                ws.send(JSON.stringify({  jobId: jobId,
																					status: 'created' })); //  Update live variable
            });

    job.on('started', (job) => {
                console.log(`status: ${job}%`);
                ws.send(JSON.stringify({  jobId: jobId,
																					status: 'rendering'}));
            });

    job.on('progress', (job, percents) => {
                console.log(`progress: ${percents}%`);
								ws.send(JSON.stringify({  jobId: jobId,
																					progress: percents }));
						});

    job.on('finished', job => {
                console.log(`status: ${jobStatus}%`);
								ws.send(JSON.stringify({  jobId: jobId,
																					status: 'finished' }));
						});
});

/* // GPT: I use this on the website?:
const ws = new WebSocket('ws://${websiteUrl}:${websitePort}');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Job Progress:', data.progress);
    document.getElementById('progress-bar').style.width = `${data.progress}%`;
};
*/



// and this is the rest of old code:

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
				let myEndpoint = '';
				let myMethod = '';

				function makeResponse(myEndpoint, myMethod) {
					responseData = await this.helpers.httpRequest({
						baseURL,
						method: myMethod,
						url: `${credentials.endpoint}${myEndpoint}`,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							'nexrender-secret': credentials.token as string,
						},
						json: true
					});
					return responseData
				}

				if (operation === 'create') {
					const body: IDataObject = {
						templateSrc: this.getNodeParameter('templateSrc', i) as string,
						composition: this.getNodeParameter('composition', i) as string,
						assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
						actions: this.getNodeParameter('actions.action', i) as IDataObject[]
					};
					myEndpoint = `/jobs`;
					myMethod = 'POST';
					responseData = makeResponse(myEndpoint, myMethod);


				} else if (operation === 'update') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					const body: IDataObject = {
						templateSrc: this.getNodeParameter('templateSrc', i) as string,
						composition: this.getNodeParameter('composition', i) as string,
						assets: this.getNodeParameter('assets.asset', i) as IDataObject[],
						actions: this.getNodeParameter('actions.action', i) as IDataObject[]
					};
					myEndpoint = `/jobs/${jobId}`;
					myMethod = 'PUT';
					responseData = makeResponse(myEndpoint, myMethod);

				} else if (operation === 'get') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					myEndpoint = `/jobs/${jobId}`;
					myMethod = 'GET';
					responseData = makeResponse(myEndpoint, myMethod);

				} else if (operation === 'list') {
					myEndpoint = `/jobs`;
					myMethod = 'GET';
					responseData = makeResponse(myEndpoint, myMethod);

				} else if (operation === 'delete') {
					const jobId = this.getNodeParameter('jobId', i) as string;
					myEndpoint = `/jobs/${jobId}`;
					myMethod = 'DELETE';
					responseData = makeResponse(myEndpoint, myMethod);

				} else if (operation === 'healthCheck') {
					myEndpoint = `/health`;
					myMethod = 'GET';
					responseData = makeResponse(myEndpoint, myMethod);
				}

				returnData.push({ json: responseData });
			} catch (error) {
				if (error.response) {
					throw new NodeApiError(this.getNode(), error);
				} else {
					throw new NodeOperationError(this.getNode(), error.message);
				}
			}
		}

		return [returnData];
	}
}
