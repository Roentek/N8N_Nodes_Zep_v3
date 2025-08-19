import { Zep } from '../nodes/Zep/Zep.node';
import { IExecuteFunctions, INodeExecutionData, NodeConnectionType } from 'n8n-workflow';

// Mock the IExecuteFunctions interface for testing
const mockExecuteFunctions = {
	getInputData: jest.fn(),
	getNodeParameter: jest.fn(),
	getCredentials: jest.fn(),
	continueOnFail: jest.fn(),
	getNode: jest.fn(),
	helpers: {
		request: jest.fn(),
	},
} as unknown as IExecuteFunctions;

// Create a properly mocked node instance for testing
const createMockNode = () => {
	const zepNode = new Zep();
	
	// Set up the mock to return the nodeInstance with the bound methods
	(mockExecuteFunctions.getNode as jest.Mock).mockReturnValue({
		name: 'ZEP Memory',
		type: 'zep',
		nodeInstance: zepNode,
		// Add the handler methods directly accessible
		handleThreadOperation: zepNode['handleThreadOperation'].bind(zepNode),
		handleMessageOperation: zepNode['handleMessageOperation'].bind(zepNode),
		handleUserOperation: zepNode['handleUserOperation'].bind(zepNode),
		handleMemoryOperation: zepNode['handleMemoryOperation'].bind(zepNode),
		handleGraphOperation: zepNode['handleGraphOperation'].bind(zepNode),
	});
	
	return zepNode;
};

describe('Zep Node', () => {
	let zepNode: Zep;

	beforeEach(() => {
		jest.clearAllMocks();
		zepNode = createMockNode();
	});

	describe('Node Description', () => {
		it('should have correct node properties', () => {
			expect(zepNode.description.displayName).toBe('ZEP Memory');
			expect(zepNode.description.name).toBe('zep');
			expect(zepNode.description.version).toBe(1);
		});

		it('should have all required resources', () => {
			const resourceProperty = zepNode.description.properties
				.find(p => p.name === 'resource');
			const resources = resourceProperty?.type === 'options' && 'options' in resourceProperty 
				? resourceProperty.options?.map((o: any) => o.value) 
				: [];
			
			expect(resources).toContain('thread');
			expect(resources).toContain('message');
			expect(resources).toContain('user');
			expect(resources).toContain('memory');
			expect(resources).toContain('graph');
		});
	});

	describe('Thread Operations', () => {
		beforeEach(() => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				baseUrl: 'https://api.getzep.com',
				apiKey: 'test-api-key',
			});
			(mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(false);
		});

		it('should create a thread', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('thread') // resource
				.mockReturnValueOnce('create') // operation
				.mockReturnValueOnce({ user_id: 'user123', title: 'Test Thread' }); // threadMetadata

			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue({
				thread_id: 'thread123',
				user_id: 'user123',
				title: 'Test Thread',
			});

			const result = await zepNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.getzep.com/threads',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
				body: {
					user_id: 'user123',
					title: 'Test Thread',
				},
			});

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveLength(1);
			expect(result[0][0].json).toEqual({
				thread_id: 'thread123',
				user_id: 'user123',
				title: 'Test Thread',
			});
		});

		it('should list threads with pagination', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('thread') // resource
				.mockReturnValueOnce('list') // operation
				.mockReturnValueOnce(25) // limit
				.mockReturnValueOnce(2); // page

			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue([
				{ thread_id: 'thread1', title: 'Thread 1' },
				{ thread_id: 'thread2', title: 'Thread 2' },
			]);

			await zepNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.getzep.com/threads',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
				qs: {
					page_size: 25,
					page_number: 2,
				},
			});
		});
	});

	describe('Message Operations', () => {
		beforeEach(() => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				baseUrl: 'https://api.getzep.com',
				apiKey: 'test-api-key',
			});
			(mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(false);
		});

		it('should add a message to a thread', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('message') // resource
				.mockReturnValueOnce('add') // operation
				.mockReturnValueOnce('thread123') // threadId
				.mockReturnValueOnce('Hello, how can I help you?') // content
				.mockReturnValueOnce('assistant'); // role

			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue({
				message_id: 'msg123',
				role: 'assistant',
				content: 'Hello, how can I help you?',
			});

			await zepNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.getzep.com/threads/thread123/messages',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
				body: {
					role: 'assistant',
					content: 'Hello, how can I help you?',
				},
			});
		});
	});

	describe('Error Handling', () => {
		beforeEach(() => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				baseUrl: 'https://api.getzep.com',
				apiKey: 'test-api-key',
			});
		});

		it('should handle API errors gracefully when continueOnFail is true', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('thread')
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('nonexistent-thread');

			(mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(true);
			(mockExecuteFunctions.helpers.request as jest.Mock).mockRejectedValue(
				new Error('Thread not found')
			);

			const result = await zepNode.execute.call(mockExecuteFunctions);

			expect(result[0][0].json).toEqual({ error: 'Thread not found' });
		});

		it('should throw error when continueOnFail is false', async () => {
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('thread')
				.mockReturnValueOnce('get')
				.mockReturnValueOnce('nonexistent-thread');

			(mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(false);
			(mockExecuteFunctions.getNode as jest.Mock).mockReturnValue({
				name: 'ZEP Memory',
				type: 'zep',
			});
			(mockExecuteFunctions.helpers.request as jest.Mock).mockRejectedValue(
				new Error('Thread not found')
			);

			await expect(zepNode.execute.call(mockExecuteFunctions)).rejects.toThrow();
		});
	});

	describe('Memory Operations', () => {
		beforeEach(() => {
			(mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue([{}]);
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue({
				baseUrl: 'https://api.getzep.com',
				apiKey: 'test-api-key',
			});
			(mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(false);
		});

		it('should perform memory search', async () => {
			// Test that the memory resource exists and has search operation
			const memoryProperty = zepNode.description.properties
				.find(p => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('memory'));
			
			expect(memoryProperty).toBeDefined();
			expect(memoryProperty?.type).toBe('options');
			
			if (memoryProperty?.type === 'options' && 'options' in memoryProperty) {
				const operations = memoryProperty.options?.map((o: any) => o.value);
				expect(operations).toContain('search');
				expect(operations).toContain('getContext');
			}
		});
	});
});

// No need to declare jest global since it's already available from @types/jest