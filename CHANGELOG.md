# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- Initial release of ZEP Memory Vector Store node for n8n v3
- Complete Thread management operations (CRUD)
- Message management with role-based messaging
- User profile management with custom fields
- Memory context retrieval and vector search
- Knowledge graph operations
- Comprehensive error handling
- Custom field support for threads and users
- Pagination support for list operations
- Vector-based similarity search
- Rich documentation and examples

### Features

- **Thread Operations**: Create, read, update, delete, and list conversation threads
- **Message Operations**: Add, retrieve, update, and delete messages with role support
- **User Management**: Full CRUD operations for user profiles with custom metadata
- **Memory Operations**: Retrieve memory context and perform vector similarity searches
- **Graph Operations**: Create and manage knowledge graphs with search capabilities
- **Authentication**: Secure API key-based authentication
- **Error Handling**: Robust error handling with detailed error messages
- **Pagination**: Support for paginated results in list operations
- **Custom Fields**: Extensible custom field support for threads and users

### Technical Details

- Built with TypeScript for type safety
- Uses n8n workflow API version 1
- Compatible with n8n 0.190.0 and higher
- Node.js 18.10.0+ support
- ESLint and Prettier configuration included
- Comprehensive test suite ready

### Documentation

- Complete README with installation and usage instructions
- Detailed API reference for all operations
- Practical examples for common use cases
- Error handling and troubleshooting guide
- Contributing guidelines

### Dependencies

- axios ^1.6.0 for HTTP requests
- n8n-workflow for node framework integration

### Dev Dependencies

- TypeScript ^4.8.4 for compilation
- ESLint with n8n-specific rules
- Prettier for code formatting
- Gulp for build automation
