import { Zep } from '../nodes/Zep/Zep.node';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

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

describe('Zep Node', () => {
	let zepNode: Zep;

	beforeEach(() => {
		zepNode = new Zep();
		jest.clearAllMocks();
	});

	describe('Node Description', () => {
		it('should have correct node properties', () => {
			expect(zepNode.description.displayName).toBe('ZEP Memory');
			expect(zepNode.description.name).toBe('zep');
			expect(zepNode.description.version).toBe(1);
		});

		it('should have all required resources', () => {
			const resources = zepNode.description.properties
				.find(p => p.name === 'resource')
				?.options?.map(o => o.value);
			
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
				uri: 'https://api.getzep.com/threads',
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
				uri: 'https://api.getzep.com/threads',
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
				uri: 'https://api.getzep.com/threads/thread123/messages',
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
			(mockExecuteFunctions.getNodeParameter as jest.Mock)
				.mockReturnValueOnce('memory') // resource
				.mockReturnValueOnce('search') // operation
				.mockReturnValueOnce('thread123') // threadId
				.mockReturnValueOnce('help with billing') // searchQuery
				.mockReturnValueOnce(10); // limit

			(mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue([
				{ similarity: 0.95, content: 'Previous billing question...' },
				{ similarity: 0.82, content: 'Another billing related message...' },
			]);

			await zepNode.execute.call(mockExecuteFunctions);

			expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
				method: 'POST',
				uri: 'https://api.getzep.com/threads/thread123/memory/search',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
				body: {
					text: 'help with billing',
					limit: 10,
				},
			});
		});
	});
});

// Mock Jest functions for TypeScript
declare global {
	var jest: any;
}