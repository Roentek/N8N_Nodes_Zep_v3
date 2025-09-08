import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IRequestOptions,
	IHttpRequestMethods,
	NodeConnectionType,
} from 'n8n-workflow';

export class Zep implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ZEP Memory',
		name: 'zep',
		icon: 'file:zep.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with ZEP Memory Vector Store v3 API',
		defaults: {
			name: 'ZEP Memory',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zepApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Thread',
						value: 'thread',
						description: 'Manage conversation threads',
					},
					{
						name: 'Message',
						value: 'message',
						description: 'Manage messages within threads',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage users',
					},
					{
						name: 'Memory',
						value: 'memory',
						description: 'Retrieve and manage memory contexts',
					},
					{
						name: 'Graph',
						value: 'graph',
						description: 'Manage knowledge graphs',
					},
				],
				default: 'thread',
			},

			// Thread Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['thread'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new thread',
						action: 'Create a thread',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a thread',
						action: 'Delete a thread',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a thread by ID',
						action: 'Get a thread',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all threads',
						action: 'List threads',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a thread',
						action: 'Update a thread',
					},
				],
				default: 'list',
			},

			// Message Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Add',
						value: 'add',
						description: 'Add a message to a thread',
						action: 'Add a message',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List messages in a thread',
						action: 'List messages',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific message',
						action: 'Get a message',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a message',
						action: 'Update a message',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a message',
						action: 'Delete a message',
					},
				],
				default: 'add',
			},

			// User Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new user',
						action: 'Create a user',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user by ID',
						action: 'Get a user',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all users',
						action: 'List users',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a user',
						action: 'Update a user',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a user',
						action: 'Delete a user',
					},
				],
				default: 'list',
			},

			// Memory Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['memory'],
					},
				},
				options: [
					{
						name: 'Get Context',
						value: 'getContext',
						description: 'Get memory context for a thread',
						action: 'Get memory context',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search memory using vector similarity',
						action: 'Search memory',
					},
				],
				default: 'getContext',
			},

			// Graph Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['graph'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a knowledge graph',
						action: 'Create a graph',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a graph by ID',
						action: 'Get a graph',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all graphs',
						action: 'List graphs',
					},
					{
						name: 'Add Data',
						value: 'addData',
						description: 'Add data to a graph',
						action: 'Add data to graph',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search graph data',
						action: 'Search graph',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a graph',
						action: 'Delete a graph',
					},
				],
				default: 'list',
			},

			// Thread ID field
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['thread', 'message', 'memory'],
						operation: ['get', 'update', 'delete', 'add', 'list', 'getContext', 'search'],
					},
					hide: {
						resource: ['thread'],
						operation: ['create', 'list'],
					},
				},
				description: 'The ID of the thread',
			},

			// User ID field
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the user',
			},

			// Message ID field
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the message',
			},

			// Graph ID field
			{
				displayName: 'Graph ID',
				name: 'graphId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['get', 'addData', 'search', 'delete'],
					},
				},
				description: 'The ID of the graph',
			},

			// Message Content
			{
				displayName: 'Message Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['add', 'update'],
					},
				},
				description: 'The content of the message',
			},

			// Message Role
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Assistant',
						value: 'assistant',
					},
					{
						name: 'System',
						value: 'system',
					},
				],
				required: true,
				default: 'user',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['add', 'update'],
					},
				},
				description: 'The role of the message sender',
			},

			// Thread metadata
			{
				displayName: 'Thread Metadata',
				name: 'threadMetadata',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'string',
						default: '',
						description: 'ID of the user associated with this thread',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Title for the thread',
					},
					{
						displayName: 'Custom Fields',
						name: 'customFields',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'field',
								displayName: 'Field',
								values: [
									{
										displayName: 'Key',
										name: 'key',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
									},
								],
							},
						],
					},
				],
			},

			// User data
			{
				displayName: 'User Data',
				name: 'userData',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'User email address',
					},
					{
						displayName: 'First Name',
						name: 'first_name',
						type: 'string',
						default: '',
						description: 'User first name',
					},
					{
						displayName: 'Last Name',
						name: 'last_name',
						type: 'string',
						default: '',
						description: 'User last name',
					},
					{
						displayName: 'Custom Fields',
						name: 'customFields',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'field',
								displayName: 'Field',
								values: [
									{
										displayName: 'Key',
										name: 'key',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
									},
								],
							},
						],
					},
				],
			},

			// Search query
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['memory', 'graph'],
						operation: ['search'],
					},
				},
				description: 'The search query text',
			},

			// Graph data input
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addData'],
					},
				},
				description: 'The data to add to the graph',
			},

			{
				displayName: 'Data Type',
				name: 'dataType',
				type: 'options',
				options: [
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'JSON',
						value: 'json',
					},
				],
				required: true,
				default: 'text',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addData'],
					},
				},
				description: 'The type of data being added',
			},

			// Graph search scope
			{
				displayName: 'Search Scope',
				name: 'scope',
				type: 'options',
				options: [
					{
						name: 'Edges',
						value: 'edges',
						description: 'Search for relationships and facts',
					},
					{
						name: 'Nodes',
						value: 'nodes',
						description: 'Search for entities',
					},
					{
						name: 'Episodes',
						value: 'episodes',
						description: 'Search for episodes',
					},
				],
				default: 'edges',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
					},
				},
				description: 'The scope of the search',
			},

			// Pagination
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						operation: ['list', 'search'],
					},
				},
			},

			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number for pagination',
				displayOptions: {
					show: {
						operation: ['list', 'search'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('zepApi');
		if (!credentials) {
			throw new NodeOperationError(this.getNode(), 'No credentials provided');
		}
		const baseURL = credentials.baseUrl as string;
		const apiKey = credentials.apiKey as string;

		if (!baseURL || !apiKey) {
			throw new NodeOperationError(this.getNode(), 'Missing required credentials: baseUrl and apiKey');
		}

		// Get reference to the node instance through context
		const node = this.getNode() as any;
		const nodeInstance = node.nodeInstance || node;

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let responseData;

			try {
				if (resource === 'thread') {
					responseData = await nodeInstance.handleThreadOperation(this, operation, i, baseURL, apiKey);
				} else if (resource === 'message') {
					responseData = await nodeInstance.handleMessageOperation(this, operation, i, baseURL, apiKey);
				} else if (resource === 'user') {
					responseData = await nodeInstance.handleUserOperation(this, operation, i, baseURL, apiKey);
				} else if (resource === 'memory') {
					responseData = await nodeInstance.handleMemoryOperation(this, operation, i, baseURL, apiKey);
				} else if (resource === 'graph') {
					responseData = await nodeInstance.handleGraphOperation(this, operation, i, baseURL, apiKey);
				}

				returnData.push({ json: responseData });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error instanceof Error ? error.message : String(error) } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error instanceof Error ? error : new Error(String(error)));
			}
		}

		return [returnData];
	}

	private async makeApiRequest(
		executeFunctions: IExecuteFunctions,
		method: IHttpRequestMethods,
		endpoint: string,
		baseURL: string,
		apiKey: string,
		body?: Record<string, any>,
		query?: Record<string, any>,
	): Promise<any> {
		const options: IRequestOptions = {
			method,
			url: `${baseURL}${endpoint}`,
			headers: {
				'Authorization': `Api-Key ${apiKey}`,
				'Content-Type': 'application/json',
			},
			json: true,
		};

		if (body) {
			options.body = body;
		}

		if (query) {
			options.qs = query;
		}

		return executeFunctions.helpers.request(options);
	}

	private async handleThreadOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseURL: string,
		apiKey: string,
	): Promise<any> {
		switch (operation) {
			case 'create':
				const threadMetadata = executeFunctions.getNodeParameter('threadMetadata', itemIndex, {}) as any;
				const createBody: any = {};
				
				if (threadMetadata.user_id) createBody.user_id = threadMetadata.user_id;
				if (threadMetadata.title) createBody.title = threadMetadata.title;
				
				// Add custom fields
				if (threadMetadata.customFields?.field) {
					for (const field of threadMetadata.customFields.field) {
						createBody[field.key] = field.value;
					}
				}

				return this.makeApiRequest(executeFunctions, 'POST', '/threads', baseURL, apiKey, createBody);

			case 'get':
				const getThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'GET', `/threads/${getThreadId}`, baseURL, apiKey);

			case 'list':
				const listQuery: any = {};
				const limit = executeFunctions.getNodeParameter('limit', itemIndex, 50) as number;
				const page = executeFunctions.getNodeParameter('page', itemIndex, 1) as number;
				
				listQuery.page_size = limit;
				listQuery.page_number = page;

				return this.makeApiRequest(executeFunctions,  'GET', '/threads', baseURL, apiKey, undefined, listQuery);

			case 'update':
				const updateThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				const updateThreadMetadata = executeFunctions.getNodeParameter('threadMetadata', itemIndex, {}) as any;
				const updateBody: any = {};
				
				if (updateThreadMetadata.user_id) updateBody.user_id = updateThreadMetadata.user_id;
				if (updateThreadMetadata.title) updateBody.title = updateThreadMetadata.title;
				
				// Add custom fields
				if (updateThreadMetadata.customFields?.field) {
					for (const field of updateThreadMetadata.customFields.field) {
						updateBody[field.key] = field.value;
					}
				}

				return this.makeApiRequest(executeFunctions, 'PATCH', `/threads/${updateThreadId}`, baseURL, apiKey, updateBody);

			case 'delete':
				const deleteThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'DELETE', `/threads/${deleteThreadId}`, baseURL, apiKey);

			default:
				throw new NodeOperationError(executeFunctions.getNode(), `Unknown thread operation: ${operation}`);
		}
	}

	private async handleMessageOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseURL: string,
		apiKey: string,
	): Promise<any> {
		switch (operation) {
			case 'add':
				const threadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				const content = executeFunctions.getNodeParameter('content', itemIndex) as string;
				const role = executeFunctions.getNodeParameter('role', itemIndex) as string;

				const messageBody = {
					role,
					content,
				};

				return this.makeApiRequest(executeFunctions, 'POST', `/threads/${threadId}/messages`, baseURL, apiKey, messageBody);

			case 'list':
				const listThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				const messageQuery: any = {};
				const limit = executeFunctions.getNodeParameter('limit', itemIndex, 50) as number;
				const page = executeFunctions.getNodeParameter('page', itemIndex, 1) as number;
				
				messageQuery.page_size = limit;
				messageQuery.page_number = page;

				return this.makeApiRequest(executeFunctions, 'GET', `/threads/${listThreadId}/messages`, baseURL, apiKey, undefined, messageQuery);

			case 'get':
				const getThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				const messageId = executeFunctions.getNodeParameter('messageId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'GET', `/threads/${getThreadId}/messages/${messageId}`, baseURL, apiKey);

			case 'update':
				const updateThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				const updateMessageId = executeFunctions.getNodeParameter('messageId', itemIndex) as string;
				const updateContent = executeFunctions.getNodeParameter('content', itemIndex) as string;
				const updateRole = executeFunctions.getNodeParameter('role', itemIndex) as string;

				const updateMessageBody = {
					role: updateRole,
					content: updateContent,
				};

				return this.makeApiRequest(executeFunctions, 'PATCH', `/threads/${updateThreadId}/messages/${updateMessageId}`, baseURL, apiKey, updateMessageBody);

			case 'delete':
				const deleteThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				const deleteMessageId = executeFunctions.getNodeParameter('messageId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'DELETE', `/threads/${deleteThreadId}/messages/${deleteMessageId}`, baseURL, apiKey);

			default:
				throw new NodeOperationError(executeFunctions.getNode(), `Unknown message operation: ${operation}`);
		}
	}

	private async handleUserOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseURL: string,
		apiKey: string,
	): Promise<any> {
		switch (operation) {
			case 'create':
				const userData = executeFunctions.getNodeParameter('userData', itemIndex, {}) as any;
				const createUserBody: any = {};
				
				if (userData.email) createUserBody.email = userData.email;
				if (userData.first_name) createUserBody.first_name = userData.first_name;
				if (userData.last_name) createUserBody.last_name = userData.last_name;
				
				// Add custom fields
				if (userData.customFields?.field) {
					for (const field of userData.customFields.field) {
						createUserBody[field.key] = field.value;
					}
				}

				return this.makeApiRequest(executeFunctions, 'POST', '/users', baseURL, apiKey, createUserBody);

			case 'get':
				const userId = executeFunctions.getNodeParameter('userId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'GET', `/users/${userId}`, baseURL, apiKey);

			case 'list':
				const userQuery: any = {};
				const limit = executeFunctions.getNodeParameter('limit', itemIndex, 50) as number;
				const page = executeFunctions.getNodeParameter('page', itemIndex, 1) as number;
				
				userQuery.page_size = limit;
				userQuery.page_number = page;

				return this.makeApiRequest(executeFunctions, 'GET', '/users', baseURL, apiKey, undefined, userQuery);

			case 'update':
				const updateUserId = executeFunctions.getNodeParameter('userId', itemIndex) as string;
				const updateUserData = executeFunctions.getNodeParameter('userData', itemIndex, {}) as any;
				const updateUserBody: any = {};
				
				if (updateUserData.email) updateUserBody.email = updateUserData.email;
				if (updateUserData.first_name) updateUserBody.first_name = updateUserData.first_name;
				if (updateUserData.last_name) updateUserBody.last_name = updateUserData.last_name;
				
				// Add custom fields
				if (updateUserData.customFields?.field) {
					for (const field of updateUserData.customFields.field) {
						updateUserBody[field.key] = field.value;
					}
				}

				return this.makeApiRequest(executeFunctions, 'PATCH', `/users/${updateUserId}`, baseURL, apiKey, updateUserBody);

			case 'delete':
				const deleteUserId = executeFunctions.getNodeParameter('userId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'DELETE', `/users/${deleteUserId}`, baseURL, apiKey);

			default:
				throw new NodeOperationError(executeFunctions.getNode(), `Unknown user operation: ${operation}`);
		}
	}

	private async handleMemoryOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseURL: string,
		apiKey: string,
	): Promise<any> {
		switch (operation) {
			case 'getContext':
				const threadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'GET', `/threads/${threadId}/memory`, baseURL, apiKey);

			case 'search':
				const searchThreadId = executeFunctions.getNodeParameter('threadId', itemIndex) as string;
				const searchQuery = executeFunctions.getNodeParameter('searchQuery', itemIndex) as string;
				const limit = executeFunctions.getNodeParameter('limit', itemIndex, 50) as number;

				const searchBody = {
					text: searchQuery,
					limit,
				};

				return this.makeApiRequest(executeFunctions, 'POST', `/threads/${searchThreadId}/memory/search`, baseURL, apiKey, searchBody);

			default:
				throw new NodeOperationError(executeFunctions.getNode(), `Unknown memory operation: ${operation}`);
		}
	}

	private async handleGraphOperation(
		executeFunctions: IExecuteFunctions,
		operation: string,
		itemIndex: number,
		baseURL: string,
		apiKey: string,
	): Promise<any> {
		switch (operation) {
			case 'create': {
				const createGraphBody = {
					name: `Graph-${Date.now()}`,
					description: 'Knowledge graph created via n8n',
				};
				return this.makeApiRequest(executeFunctions, 'POST', '/graph', baseURL, apiKey, createGraphBody);
			}

			case 'get': {
				const graphId = executeFunctions.getNodeParameter('graphId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'GET', `/graph/${graphId}`, baseURL, apiKey);
			}

			case 'list': {
				const graphQuery: any = {};
				const limit = executeFunctions.getNodeParameter('limit', itemIndex, 50) as number;
				const page = executeFunctions.getNodeParameter('page', itemIndex, 1) as number;
				
				graphQuery.page_size = limit;
				graphQuery.page_number = page;

				return this.makeApiRequest(executeFunctions, 'GET', '/graphs', baseURL, apiKey, undefined, graphQuery);
			}

			case 'addData': {
				const addDataGraphId = executeFunctions.getNodeParameter('graphId', itemIndex) as string;
				const data = executeFunctions.getNodeParameter('data', itemIndex, 'Sample graph data') as string;
				const dataType = executeFunctions.getNodeParameter('dataType', itemIndex, 'text') as string;
				
				const graphData = {
					data: data,
					type: dataType,
				};
				return this.makeApiRequest(executeFunctions, 'POST', '/graph', baseURL, apiKey, graphData);
			}

			case 'search': {
				const searchGraphId = executeFunctions.getNodeParameter('graphId', itemIndex) as string;
				const graphSearchQuery = executeFunctions.getNodeParameter('searchQuery', itemIndex) as string;
				const graphLimit = executeFunctions.getNodeParameter('limit', itemIndex, 50) as number;
				const scope = executeFunctions.getNodeParameter('scope', itemIndex, 'edges') as string;

				const graphSearchBody = {
					graph_id: searchGraphId,
					query: graphSearchQuery,
					limit: graphLimit,
					scope: scope,
				};

				return this.makeApiRequest(executeFunctions, 'POST', '/graph/search', baseURL, apiKey, graphSearchBody);
			}

			case 'delete': {
				const deleteGraphId = executeFunctions.getNodeParameter('graphId', itemIndex) as string;
				return this.makeApiRequest(executeFunctions, 'DELETE', `/graph/${deleteGraphId}`, baseURL, apiKey);
			}

			default:
				throw new NodeOperationError(executeFunctions.getNode(), `Unknown graph operation: ${operation}`);
		}
	}
}