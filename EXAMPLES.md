# ZEP Memory Node Examples

This document provides practical examples of using the ZEP Memory node in various scenarios.

## Table of Contents

1. [Basic Chat Memory](#basic-chat-memory)
2. [Customer Support Bot](#customer-support-bot)
3. [User Profile Management](#user-profile-management)
4. [Knowledge Base Integration](#knowledge-base-integration)
5. [Multi-User Conversations](#multi-user-conversations)
6. [Memory Search and Retrieval](#memory-search-and-retrieval)

## Basic Chat Memory

### Scenario: Simple chatbot with persistent memory

**Workflow Steps:**

1. **Create or Get Thread**
2. **Add User Message**
3. **Get Memory Context**
4. **Process with AI**
5. **Add Assistant Response**

```json
{
  "nodes": [
    {
      "name": "Get or Create Thread",
      "type": "zep",
      "parameters": {
        "resource": "thread",
        "operation": "create",
        "threadMetadata": {
          "user_id": "{{ $json.user_id }}",
          "title": "Chat with {{ $json.user_name }}"
        }
      }
    },
    {
      "name": "Add User Message",
      "type": "zep", 
      "parameters": {
        "resource": "message",
        "operation": "add",
        "threadId": "{{ $node['Get or Create Thread'].json.thread_id }}",
        "role": "user",
        "content": "{{ $json.user_message }}"
      }
    },
    {
      "name": "Get Memory Context",
      "type": "zep",
      "parameters": {
        "resource": "memory",
        "operation": "getContext", 
        "threadId": "{{ $node['Get or Create Thread'].json.thread_id }}"
      }
    },
    {
      "name": "Add Assistant Response",
      "type": "zep",
      "parameters": {
        "resource": "message",
        "operation": "add",
        "threadId": "{{ $node['Get or Create Thread'].json.thread_id }}",
        "role": "assistant",
        "content": "{{ $json.ai_response }}"
      }
    }
  ]
}
```

## Customer Support Bot

### Scenario: Support bot that remembers customer issues and preferences

**Workflow Steps:**

1. **Create Customer Profile**
2. **Search Previous Issues**
3. **Create Support Thread**
4. **Log Interaction**

```json
{
  "nodes": [
    {
      "name": "Create Customer Profile",
      "type": "zep",
      "parameters": {
        "resource": "user",
        "operation": "create",
        "userData": {
          "email": "{{ $json.customer_email }}",
          "first_name": "{{ $json.first_name }}",
          "last_name": "{{ $json.last_name }}",
          "customFields": {
            "field": [
              {"key": "tier", "value": "{{ $json.subscription_tier }}"},
              {"key": "signup_date", "value": "{{ $json.signup_date }}"},
              {"key": "total_orders", "value": "{{ $json.order_count }}"}
            ]
          }
        }
      }
    },
    {
      "name": "Search Similar Issues",
      "type": "zep",
      "parameters": {
        "resource": "memory",
        "operation": "search",
        "threadId": "{{ $json.previous_thread_id }}",
        "searchQuery": "{{ $json.issue_description }}",
        "limit": 5
      }
    },
    {
      "name": "Create Support Thread",
      "type": "zep",
      "parameters": {
        "resource": "thread", 
        "operation": "create",
        "threadMetadata": {
          "user_id": "{{ $node['Create Customer Profile'].json.user_id }}",
          "title": "Support: {{ $json.issue_category }}",
          "customFields": {
            "field": [
              {"key": "priority", "value": "{{ $json.priority }}"},
              {"key": "category", "value": "{{ $json.issue_category }}"},
              {"key": "source", "value": "chatbot"}
            ]
          }
        }
      }
    },
    {
      "name": "Log Initial Message",
      "type": "zep",
      "parameters": {
        "resource": "message",
        "operation": "add",
        "threadId": "{{ $node['Create Support Thread'].json.thread_id }}",
        "role": "user",
        "content": "{{ $json.issue_description }}"
      }
    }
  ]
}
```

## User Profile Management

### Scenario: Manage customer profiles with preferences and history

```json
{
  "nodes": [
    {
      "name": "Update User Profile",
      "type": "zep",
      "parameters": {
        "resource": "user",
        "operation": "update",
        "userId": "{{ $json.user_id }}",
        "userData": {
          "customFields": {
            "field": [
              {"key": "last_login", "value": "{{ $now }}"},
              {"key": "preferred_language", "value": "{{ $json.language }}"},
              {"key": "notification_preferences", "value": "{{ $json.notifications }}"},
              {"key": "interaction_count", "value": "{{ $json.interaction_count + 1 }}"}
            ]
          }
        }
      }
    },
    {
      "name": "Get User Threads",
      "type": "zep",
      "parameters": {
        "resource": "thread",
        "operation": "list",
        "limit": 20
      }
    }
  ]
}
```

## Knowledge Base Integration

### Scenario: Create and search knowledge graphs for FAQ and documentation

```json
{
  "nodes": [
    {
      "name": "Create Knowledge Graph",
      "type": "zep",
      "parameters": {
        "resource": "graph",
        "operation": "create"
      }
    },
    {
      "name": "Add FAQ Data",
      "type": "zep",
      "parameters": {
        "resource": "graph",
        "operation": "addData",
        "graphId": "{{ $node['Create Knowledge Graph'].json.graph_id }}"
      }
    },
    {
      "name": "Search Knowledge Base",
      "type": "zep", 
      "parameters": {
        "resource": "graph",
        "operation": "search",
        "graphId": "{{ $node['Create Knowledge Graph'].json.graph_id }}",
        "searchQuery": "{{ $json.user_question }}",
        "limit": 3
      }
    }
  ]
}
```

## Multi-User Conversations

### Scenario: Group chat or team collaboration with shared memory

```json
{
  "nodes": [
    {
      "name": "Create Group Thread",
      "type": "zep",
      "parameters": {
        "resource": "thread",
        "operation": "create", 
        "threadMetadata": {
          "title": "{{ $json.group_name }} Discussion",
          "customFields": {
            "field": [
              {"key": "type", "value": "group_chat"},
              {"key": "members", "value": "{{ $json.member_ids.join(',') }}"},
              {"key": "created_by", "value": "{{ $json.creator_id }}"}
            ]
          }
        }
      }
    },
    {
      "name": "Add Member Message",
      "type": "zep",
      "parameters": {
        "resource": "message", 
        "operation": "add",
        "threadId": "{{ $node['Create Group Thread'].json.thread_id }}",
        "role": "user",
        "content": "{{ $json.message_content }}"
      }
    },
    {
      "name": "Get Recent Messages",
      "type": "zep",
      "parameters": {
        "resource": "message",
        "operation": "list",
        "threadId": "{{ $node['Create Group Thread'].json.thread_id }}",
        "limit": 50
      }
    }
  ]
}
```

## Memory Search and Retrieval

### Scenario: Advanced memory search for personalized responses

```json
{
  "nodes": [
    {
      "name": "Search User History",
      "type": "zep",
      "parameters": {
        "resource": "memory",
        "operation": "search",
        "threadId": "{{ $json.user_thread_id }}",
        "searchQuery": "{{ $json.current_topic }}",
        "limit": 10
      }
    },
    {
      "name": "Get Full Context",
      "type": "zep",
      "parameters": {
        "resource": "memory",
        "operation": "getContext",
        "threadId": "{{ $json.user_thread_id }}"
      }
    },
    {
      "name": "Analyze Patterns",
      "type": "code",
      "parameters": {
        "jsCode": "// Process memory results to identify patterns\nconst searchResults = $node['Search User History'].json;\nconst context = $node['Get Full Context'].json;\n\nconst patterns = {\n  frequent_topics: [],\n  sentiment_trend: 'neutral',\n  interaction_frequency: 0,\n  preferred_response_style: 'formal'\n};\n\n// Analyze search results\nif (searchResults && searchResults.length > 0) {\n  patterns.frequent_topics = searchResults.map(r => r.topic).filter(Boolean);\n  patterns.interaction_frequency = searchResults.length;\n}\n\n// Analyze context for sentiment and style\nif (context && context.summary) {\n  patterns.sentiment_trend = context.summary.sentiment || 'neutral';\n  patterns.preferred_response_style = context.summary.style || 'formal';\n}\n\nreturn { json: patterns };"
      }
    }
  ]
}
```

## Error Handling Examples

### Example: Robust error handling with fallbacks

```json
{
  "nodes": [
    {
      "name": "Try Get Thread",
      "type": "zep",
      "parameters": {
        "resource": "thread",
        "operation": "get",
        "threadId": "{{ $json.thread_id }}"
      },
      "continueOnFail": true
    },
    {
      "name": "Check If Thread Exists",
      "type": "if",
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "{{ $node['Try Get Thread'].json.error }}",
              "operation": "isEmpty"
            }
          ]
        }
      }
    },
    {
      "name": "Create New Thread",
      "type": "zep", 
      "parameters": {
        "resource": "thread",
        "operation": "create",
        "threadMetadata": {
          "user_id": "{{ $json.user_id }}",
          "title": "New conversation"
        }
      }
    },
    {
      "name": "Use Existing Thread",
      "type": "noOp"
    }
  ]
}
```

## Performance Optimization

### Example: Batch operations and caching

```json
{
  "nodes": [
    {
      "name": "Batch Get Users", 
      "type": "zep",
      "parameters": {
        "resource": "user",
        "operation": "list",
        "limit": 100
      }
    },
    {
      "name": "Cache Results",
      "type": "code",
      "parameters": {
        "jsCode": "// Cache user data for subsequent operations\nconst users = $node['Batch Get Users'].json;\nconst userCache = {};\n\nif (users && users.length > 0) {\n  users.forEach(user => {\n    userCache[user.user_id] = user;\n  });\n}\n\n// Store in workflow static data for reuse\nreturn { json: { userCache, timestamp: new Date().toISOString() } };"
      }
    }
  ]
}
```

## Integration Examples

### Example: ZEP + OpenAI + Webhook

```json
{
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "webhook"
    },
    {
      "name": "Get Memory Context", 
      "type": "zep",
      "parameters": {
        "resource": "memory",
        "operation": "getContext",
        "threadId": "{{ $json.thread_id }}"
      }
    },
    {
      "name": "OpenAI Chat",
      "type": "openAi",
      "parameters": {
        "resource": "chat",
        "operation": "create",
        "messages": [
          {
            "role": "system",
            "content": "Context: {{ $node['Get Memory Context'].json.summary }}"
          },
          {
            "role": "user", 
            "content": "{{ $json.user_message }}"
          }
        ]
      }
    },
    {
      "name": "Store AI Response",
      "type": "zep",
      "parameters": {
        "resource": "message",
        "operation": "add",
        "threadId": "{{ $json.thread_id }}",
        "role": "assistant",
        "content": "{{ $node['OpenAI Chat'].json.choices[0].message.content }}"
      }
    },
    {
      "name": "Respond to Webhook",
      "type": "respondToWebhook",
      "parameters": {
        "responseData": "{{ $node['OpenAI Chat'].json.choices[0].message.content }}"
      }
    }
  ]
}
```

These examples demonstrate the flexibility and power of the ZEP Memory node in various use cases. Adapt them to your specific needs and workflow requirements.
