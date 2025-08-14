# ZEP Memory Vector Store Node (v3) for n8n

This is a custom n8n node package that provides integration with ZEP Memory Vector Store API v3. ZEP is a long-term memory service for AI assistants and chatbots.

## Features

### 🧵 Thread Management

- Create, read, update, and delete conversation threads
- List threads with pagination and sorting
- Associate threads with users

### 💬 Message Management

- Add messages to threads with roles (user, assistant, system)
- Retrieve and update existing messages
- Full message history management

### 👤 User Management

- Create and manage user profiles
- Associate users with threads and conversations
- Custom user metadata support

### 🧠 Memory Operations

- Retrieve memory context for threads
- Vector-based similarity search across conversations
- Long-term memory persistence

### 📊 Knowledge Graph Support

- Create and manage knowledge graphs
- Add structured data to graphs
- Search graph data with vector similarity

## Installation

### Prerequisites

- n8n version 0.190.0 or higher
- Node.js 18.10.0 or higher
- pnpm 7.18.0 or higher

### Install from Source

1. Clone or download this repository
2. Navigate to the `zep_node_v3` directory
3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Build the node:

   ```bash
   pnpm build
   ```

5. Link to your n8n installation:

   ```bash
   # In your n8n installation directory
   npm install /path/to/zep_node_v3
   ```

### Install as Community Package

1. In n8n, go to Settings → Community Nodes
2. Install package: `n8n-nodes-zep-v3`

## Configuration

### 1. Create ZEP API Credentials

1. Go to Settings → Credentials in your n8n instance
2. Click "Create New Credential"
3. Search for "ZEP API" and select it
4. Configure the following:
   - **API Key**: Your ZEP API key
   - **Base URL**: Your ZEP instance URL (default: `https://api.getzep.com`)
   - **Project UUID**: (Optional) Your project UUID

### 2. Add ZEP Node to Workflow

1. In your workflow, click the "+" button to add a new node
2. Search for "ZEP Memory" and select it
3. Choose the credential you created above
4. Select the resource and operation you want to perform

## Usage Examples

### Example 1: Create a Thread and Add Messages

**Step 1: Create Thread**  

- Resource: Thread
- Operation: Create
- Thread Metadata:
  - User ID: `user_123`
  - Title: `Customer Support Chat`

**Step 2: Add User Message**  

- Resource: Message
- Operation: Add
- Thread ID: `{{ $node["Create Thread"].json["thread_id"] }}`
- Role: User
- Content: `Hello, I need help with my account`

**Step 3: Add Assistant Response**  

- Resource: Message
- Operation: Add  
- Thread ID: `{{ $node["Create Thread"].json["thread_id"] }}`
- Role: Assistant
- Content: `I'd be happy to help you with your account. What specific issue are you experiencing?`

### Example 2: Search Memory Context

**Search Similar Conversations**  

- Resource: Memory
- Operation: Search
- Thread ID: `thread_456`
- Search Query: `account billing issues`
- Limit: `10`

### Example 3: User Management

**Create User Profile**  

- Resource: User
- Operation: Create
- User Data:
  - Email: `customer@example.com`
  - First Name: `John`
  - Last Name: `Doe`
  - Custom Fields:
    - Key: `tier`, Value: `premium`
    - Key: `region`, Value: `north_america`

## API Operations

### Thread Operations

- **Create**: Create a new conversation thread
- **Get**: Retrieve a specific thread by ID
- **List**: Get all threads with pagination
- **Update**: Modify thread metadata
- **Delete**: Remove a thread permanently

### Message Operations

- **Add**: Add a new message to a thread
- **Get**: Retrieve a specific message
- **List**: Get all messages in a thread
- **Update**: Modify an existing message
- **Delete**: Remove a message

### User Operations

- **Create**: Create a new user profile
- **Get**: Retrieve user details
- **List**: Get all users with pagination
- **Update**: Modify user information
- **Delete**: Remove a user

### Memory Operations

- **Get Context**: Retrieve memory context for a thread
- **Search**: Perform vector similarity search

### Graph Operations

- **Create**: Create a new knowledge graph
- **Get**: Retrieve graph details
- **List**: Get all graphs
- **Add Data**: Add data to a graph
- **Search**: Search graph data
- **Delete**: Remove a graph

## Error Handling

The node includes comprehensive error handling:

- **Network Errors**: Automatic retry for transient failures
- **Authentication Errors**: Clear error messages for invalid credentials  
- **Validation Errors**: Field-level validation with helpful messages
- **Rate Limiting**: Proper handling of API rate limits

When "Continue on Fail" is enabled, errors are returned as part of the output data rather than stopping workflow execution.

## Advanced Configuration

### Custom Fields

Both threads and users support custom fields for storing additional metadata:

```javascript
// Thread custom fields
{
  "customFields": {
    "field": [
      {"key": "priority", "value": "high"},
      {"key": "department", "value": "support"},
      {"key": "category", "value": "technical"}
    ]
  }
}

// User custom fields  
{
  "customFields": {
    "field": [
      {"key": "subscription", "value": "premium"},
      {"key": "onboarding_complete", "value": "true"}
    ]
  }
}
```

### Pagination

List operations support pagination:

- **Limit**: Number of results per page (default: 50)
- **Page**: Page number to retrieve (default: 1)

### Vector Search

Memory and graph search operations use vector similarity:

- **Search Query**: Natural language query text
- **Limit**: Maximum number of results to return
- Results are ranked by semantic similarity

## Troubleshooting

### Common Issues

**1. Authentication Errors**  

- Verify your API key is correct
- Check that your ZEP instance URL is accessible
- Ensure your API key has the necessary permissions

**2. Thread Not Found**  

- Verify the thread ID exists
- Check that you have access to the thread
- Ensure the thread wasn't deleted

**3. Rate Limiting**  

- ZEP API has rate limits that vary by plan
- The node will automatically retry after rate limit periods
- Consider adding delays between operations for high-volume workflows

**4. Connection Timeouts**  

- Check your network connectivity to ZEP
- Verify your ZEP instance is responding
- Try increasing the timeout in n8n's global settings

### Debug Mode

Enable debug mode in n8n to see detailed API requests and responses:

1. Set `N8N_LOG_LEVEL=debug` in your environment
2. Check the n8n logs for detailed API interaction information

## Support

- **ZEP Documentation**: [https://help.getzep.com/](https://help.getzep.com/)
- **n8n Community**: [https://community.n8n.io/](https://community.n8n.io/)
- **GitHub Issues**: Report bugs and request features

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### v1.0.0

- Initial release with full ZEP v3 API support
- Thread, Message, User, Memory, and Graph operations
- Comprehensive error handling and validation
- Custom fields support
- Vector search capabilities
