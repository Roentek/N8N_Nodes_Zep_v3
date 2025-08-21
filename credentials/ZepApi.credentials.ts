import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZepApi implements ICredentialType {
	name = 'zepApi';
	displayName = 'ZEP API';
	documentationUrl = 'https://help.getzep.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for ZEP Memory Vector Store',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.getzep.com',
			required: true,
			description: 'The base URL for your ZEP instance',
		},
		{
			displayName: 'Project UUID',
			name: 'projectUuid',
			type: 'string',
			default: '',
			required: false,
			description: 'Your ZEP project UUID (optional, can be set per operation)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Api-Key {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/threads',
			method: 'GET',
			headers: {
				Authorization: '=Api-Key {{$credentials.apiKey}}',
			},
		},
	};
}