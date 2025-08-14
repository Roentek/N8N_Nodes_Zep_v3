# Claude Code Workspace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n version](https://img.shields.io/badge/n8n-^1.104.1-orange.svg)](https://github.com/n8n-io/n8n)

Streamline your development workflow by leveraging Claude Code's intelligent code generation capabilities to rapidly prototype, test, and compare implementations across multiple programming languages and frameworks.

## 📖 Overview

Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows - all through natural language commands. It embeds Claude Opus 4—the same model our researchers and engineers use—right in your terminal with deep codebase awareness and the ability to edit files and run commands directly in your environment.

## 📄 What Claude Code Can Do

- **Build features from descriptions**: Tell Claude what you want to build in plain English. It will make a plan, write the code, and ensure it works
- **Debug and fix issues**: Describe a bug or paste an error message. Claude Code will analyze your codebase, identify the problem, and implement a fix
- **Navigate any codebase**: Ask anything about your team's codebase, and get thoughtful answers back
- **Make coordinated changes**: Makes coordinated changes across multiple files
- **Automate tedious tasks**: Fix lint issues, resolve merge conflicts, and write release notes

## ⚠️ Prerequisites

Before installing Claude Code, ensure you have:

- **[Node.js](https://nodejs.org/en/download/) 18 or newer**
- **VS Code** installed on your system
- A **Claude subscription** (Pro, Max) or **Anthropic API key**
- **Git** installed and configured
- A stable internet connection

## 💾 Installation

### Step 1: Install Claude Code CLI

Open your terminal and run:

```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2: Initial Authentication

Navigate to any project directory and run Claude Code for the first time:

```bash
cd your-project-directory
claude
```

You'll complete a one-time OAuth process with your Claude Max or Anthropic Console account. Follow the prompts to authenticate with your Anthropic account.

### Step 3: VS Code Extension Setup

Open VS Code, open the integrated terminal, and run `claude` - the extension will auto-install.

Alternatively, you can manually install the extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Claude Code for VSCode" by Anthropic
4. Click Install
5. Restart VS Code

## 🔗 VS Code Integration Features

Once installed, you'll have access to these powerful features:

### Quick Launch

- **Keyboard shortcut**: Use `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows/Linux) to open Claude Code directly from your editor
- **UI button**: Click the Claude Code button in the VS Code interface

### Smart Context Sharing

- **Selection context**: The current selection/tab in the IDE is automatically shared with Claude Code
- **Diagnostic sharing**: Diagnostic errors (lint, syntax, etc.) from the IDE are automatically shared with Claude as you work
- **File reference shortcuts**: Use `Cmd+Option+K` (Mac) or `Alt+Ctrl+K` (Linux/Windows) to insert file references (e.g., @File#L1-99)

### Diff Viewing

- Code changes can be displayed directly in the IDE diff viewer instead of the terminal
- Configure this in `/config` within Claude Code

## 🔧 Configuration

### Basic Configuration

1. **Run configuration setup**:

   ```bash
   claude
   /config
   ```

2. **Set diff tool to auto** for automatic IDE detection:

   ```bash
   Set diff tool to: auto
   ```

### Project-Specific Setup

Create a `CLAUDE.md` file in your project root to provide Claude with example project context:

```markdown
# Project Setup for Claude Code

## Branch Naming Convention
- Use `feature/` prefix for new features
- Use `bugfix/` prefix for bug fixes
- Use `hotfix/` prefix for urgent fixes

## Environment Setup
- Node.js version: 18+
- Package manager: npm/yarn
- Testing framework: Jest

## Code Standards
- ESLint configuration in `.eslintrc.js`
- Prettier formatting enabled
- TypeScript strict mode enabled

## Known Issues
- Database connection requires VPN
- Tests require environment variables in `.env.test`
```

### Advanced Terminal Setup

Since it's a terminal interface, there are some non-obvious behaviors: Shift+Enter doesn't work by default for new lines. Just tell Claude to set up your terminal with `/terminal-setup` and it'll fix it for you.

Run this command in Claude Code:

```bash
/terminal-setup
```

## ⚡ Basic Usage

### Starting Claude Code

1. **From VS Code integrated terminal**:

   ```bash
   cd your-project
   claude
   ```

2. **From external terminal** (then connect to VS Code):

   ```bash
   cd your-project
   claude
   /ide
   ```

### Essential Commands

- `/help` - Show available commands
- `/ide` - Connect to your IDE from external terminal
- `/config` - Configure Claude Code settings
- `/terminal-setup` - Set up terminal for better experience
- `/bug` - Report issues directly to Anthropic
- `/install-github-app` - Set up automatic PR reviews

### Example Prompting

**Analyze your Codebase**:

```bash
Explain the architecture of this React app
```

**Build a New Feature**:

```bash
Create a user authentication component with login and signup forms using React hooks
```

**Debug an Issue**:

```bash
I'm getting a "Cannot read property 'map' of undefined" error in UserList.jsx. Can you find and fix it?
```

**Refactor Code**:

```bash
Refactor the authentication logic to use a custom hook
```

## 🤖 N8N-MCP with Claude-Code

### N8N MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to n8n node documentation, properties, and operations. Deploy in minutes to give Claude and other AI assistants deep knowledge about n8n's 525+ workflow automation nodes.

- Click [n8n-MCP](https://github.com/czlonkowski/n8n-mcp) for the n8n-mcp repository and documentation
- Click [Claude-Code for VSCode](https://github.com/czlonkowski/n8n-mcp/blob/main/docs/CLAUDE_CODE_SETUP.md) for the VSCode setup guide

### Setup for Claude-Code

Connect n8n-MCP to Claude Code CLI for enhanced n8n workflow development from the command line.

### Option 1: NPX (Fastest - No Installation)

**Prerequisites:** [Node.js](https://nodejs.org/) installed on your system.

```bash
# Run directly with npx (no installation needed!)
npx n8n-mcp
```

Copy to `.mcp.json` in the project root or add to Claude Desktop config:

**Basic Configuration (documentation tools only):**

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true"
      }
    }
  }
}
```

**Full Configuration (with n8n management tools):**

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

Then use with scope flag:

```bash
claude mcp add n8n-mcp --scope project
```

> **Note**: npx will download and run the latest version automatically. The package includes a pre-built database with all n8n node information.

**Configuration file locations:**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

> 💡 **NOTE:** Restart Claude Desktop after updating configuration

### Option 2: Claude CLI (Native Integration)

#### Basic configuration (documentation tools only)

```bash
claude mcp add n8n-mcp \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -- npx n8n-mcp
```

![Adding n8n-MCP server in Claude Code](./img/cc_command.png)

#### Full configuration (n8n management tools)

```bash
claude mcp add n8n-mcp \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -e N8N_API_URL=https://your-n8n-instance.com \
  -e N8N_API_KEY=your-api-key \
  -- npx n8n-mcp
```

Make sure to replace https://`your-n8n-instance`.com with your actual n8n URL and your-api-key with your n8n API key.

### Option 3: Local Installation (For Development)

**Prerequisites:** [Node.js](https://nodejs.org/) installed on your system

```bash
# 1. Clone and setup
git clone https://github.com/czlonkowski/n8n-mcp.git
cd n8n-mcp
npm install
npm run build
npm run rebuild

# 2. Test it works
npm start
```

Copy to .mcp.json in the project root or add to Claude Desktop config:

**Basic configuration (documentation tools only):**

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/n8n-mcp/dist/mcp/index.js"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true"
      }
    }
  }
}
```

**Full configuration (with n8n management tools):**

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/n8n-mcp/dist/mcp/index.js"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

> 💡 **NOTE:** The n8n API credentials can be configured either in a `.env` file (create from `.env.example`) or directly in the Claude config as shown above.
> 💡 **TIP:** If you’re running n8n locally on the same machine (e.g., via Docker), use `http://host.docker.internal:5678` as the N8N_API_URL.

### Option 4: Local Installation (npm Project)

**Prerequisites:** [Node.js](https://nodejs.org/) installed on your system

```bash
# 1. Install all node modules for n8n-mcp to the local project
npm install n8n-mcp

# 2. Fund the npm libraries
npm fund
```

This will install the n8n-mcp files and dependecies to the local project using npm.  

### Option 5: Railway Cloud Deployment (One-Click Deploy)

**Prerequisites:** Railway account (free tier available)

Deploy n8n-MCP to Railway's cloud platform with zero configuration:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/n8n-mcp?referralCode=n8n-mcp)

**Benefits:**

- ☁️ **Instant cloud hosting** - No server setup required
- 🔒 **Secure by default** - HTTPS included, auth token warnings
- 🌐 **Global access** - Connect from any Claude Desktop
- ⚡ **Auto-scaling** - Railway handles the infrastructure
- 📊 **Built-in monitoring** - Logs and metrics included

**Quick Setup:**

1. Click the "Deploy on Railway" button above
2. Sign in to Railway (or create a free account)
3. Configure your deployment (project name, region)
4. Click "Deploy" and wait ~2-3 minutes
5. Copy your deployment URL and auth token
6. Add to Claude Desktop config using the HTTPS URL

> 📚 **For detailed setup instructions, troubleshooting, and configuration examples, see our [Railway Deployment Guide](./docs/RAILWAY_DEPLOYMENT.md)**

**Configuration file locations:**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

> **Note:** Restart Claude Desktop after updating configuration**

### Managing Your MCP Server

Check server status:

```bash
claude mcp list
claude mcp get n8n-mcp
```

During a conversation, use the `/mcp` command to see server status and available tools.

![n8n-MCP connected and showing 39 tools available](./img/cc_connected.png)

Remove the server:

```bash
claude mcp remove n8n-mcp
```

### CLAUDE Context Instructions

For the best results when using n8n-MCP with Claude Projects, create a `CLAUDE.md` file in your project root with the enhanced system instructions:

```markdown
# CLAUDE Context Instructions

You are an expert in n8n automation software using n8n-MCP tools. Your role is to design, build, and validate n8n workflows with maximum accuracy and efficiency.

## Core Workflow Process

1. **ALWAYS start new conversation with**: `tools_documentation()` to understand best practices and available tools.

2. **Discovery Phase** - Find the right nodes:
   - Think deeply about user request and the logic you are going to build to fulfill it. Ask follow-up questions to clarify the user's intent, if something is unclear. Then, proceed with the rest of your instructions.
   - `search_nodes({query: 'keyword'})` - Search by functionality
   - `list_nodes({category: 'trigger'})` - Browse by category
   - `list_ai_tools()` - See AI-capable nodes (remember: ANY node can be an AI tool!)

3. **Configuration Phase** - Get node details efficiently:
   - `get_node_essentials(nodeType)` - Start here! Only 10-20 essential properties
   - `search_node_properties(nodeType, 'auth')` - Find specific properties
   - `get_node_for_task('send_email')` - Get pre-configured templates
   - `get_node_documentation(nodeType)` - Human-readable docs when needed
   - It is good common practice to show a visual representation of the workflow architecture to the user and asking for opinion, before moving forward. 

4. **Pre-Validation Phase** - Validate BEFORE building:
   - `validate_node_minimal(nodeType, config)` - Quick required fields check
   - `validate_node_operation(nodeType, config, profile)` - Full operation-aware validation
   - Fix any validation errors before proceeding

5. **Building Phase** - Create the workflow:
   - Use validated configurations from step 4
   - Connect nodes with proper structure
   - Add error handling where appropriate
   - Use expressions like $json, $node["NodeName"].json
   - Build the workflow in an artifact for easy editing downstream (unless the user asked to create in n8n instance)

6. **Workflow Validation Phase** - Validate complete workflow:
   - `validate_workflow(workflow)` - Complete validation including connections
   - `validate_workflow_connections(workflow)` - Check structure and AI tool connections
   - `validate_workflow_expressions(workflow)` - Validate all n8n expressions
   - Fix any issues found before deployment

7. **Deployment Phase** (if n8n API configured):
   - `n8n_create_workflow(workflow)` - Deploy validated workflow
   - `n8n_validate_workflow({id: 'workflow-id'})` - Post-deployment validation
   - `n8n_update_partial_workflow()` - Make incremental updates using diffs
   - `n8n_trigger_webhook_workflow()` - Test webhook workflows

## Key Insights

- **USE CODE NODE ONLY WHEN IT IS NECESSARY** - always prefer to use standard nodes over code node. Use code node only when you are sure you need it.
- **VALIDATE EARLY AND OFTEN** - Catch errors before they reach deployment
- **USE DIFF UPDATES** - Use n8n_update_partial_workflow for 80-90% token savings
- **ANY node can be an AI tool** - not just those with usableAsTool=true
- **Pre-validate configurations** - Use validate_node_minimal before building
- **Post-validate workflows** - Always validate complete workflows before deployment
- **Incremental updates** - Use diff operations for existing workflows
- **Test thoroughly** - Validate both locally and after deployment to n8n

## Validation Strategy

### Before Building

1. validate_node_minimal() - Check required fields
2. validate_node_operation() - Full configuration validation
3. Fix all errors before proceeding

### After Building

1. validate_workflow() - Complete workflow validation
2. validate_workflow_connections() - Structure validation
3. validate_workflow_expressions() - Expression syntax check

### After Deployment

1. n8n_validate_workflow({id}) - Validate deployed workflow
2. n8n_list_executions() - Monitor execution status
3. n8n_update_partial_workflow() - Fix issues using diffs

## Response Structure

1. **Discovery**: Show available nodes and options
2. **Pre-Validation**: Validate node configurations first
3. **Configuration**: Show only validated, working configs
4. **Building**: Construct workflow with validated components
5. **Workflow Validation**: Full workflow validation results
6. **Deployment**: Deploy only after all validations pass
7. **Post-Validation**: Verify deployment succeeded

## Example Workflow

### 1. Discovery & Configuration
search_nodes({query: 'slack'})
get_node_essentials('n8n-nodes-base.slack')

### 2. Pre-Validation
validate_node_minimal('n8n-nodes-base.slack', {resource:'message', operation:'send'})
validate_node_operation('n8n-nodes-base.slack', fullConfig, 'runtime')

### 3. Build Workflow
// Create workflow JSON with validated configs

### 4. Workflow Validation
validate_workflow(workflowJson)
validate_workflow_connections(workflowJson)
validate_workflow_expressions(workflowJson)

### 5. Deploy (if configured)
n8n_create_workflow(validatedWorkflow)
n8n_validate_workflow({id: createdWorkflowId})

### 6. Update Using Diffs
n8n_update_partial_workflow({
  workflowId: id,
  operations: [
    {type: 'updateNode', nodeId: 'slack1', changes: {position: [100, 200]}}
  ]
})

## Important Rules

- ALWAYS validate before building
- ALWAYS validate after building
- NEVER deploy unvalidated workflows
- USE diff operations for updates (80-90% token savings)
- STATE validation results clearly
- FIX all errors before proceeding
```

Save these instructions in your Claude Project for optimal n8n workflow assistance with comprehensive validation.

## 📡 Available MCP Tools

Once connected, Claude can use these powerful tools:

### Core Tools

- **`tools_documentation`** - Get documentation for any MCP tool (START HERE!)
- **`list_nodes`** - List all n8n nodes with filtering options
- **`get_node_info`** - Get comprehensive information about a specific node
- **`get_node_essentials`** - Get only essential properties with examples (10-20 properties instead of 200+)
- **`search_nodes`** - Full-text search across all node documentation
- **`search_node_properties`** - Find specific properties within nodes
- **`list_ai_tools`** - List all AI-capable nodes (ANY node can be used as AI tool!)
- **`get_node_as_tool_info`** - Get guidance on using any node as an AI tool

### Advanced Tools

- **`get_node_for_task`** - Pre-configured node settings for common tasks
- **`list_tasks`** - Discover available task templates
- **`validate_node_operation`** - Validate node configurations (operation-aware, profiles support)
- **`validate_node_minimal`** - Quick validation for just required fields
- **`validate_workflow`** - Complete workflow validation including AI tool connections
- **`validate_workflow_connections`** - Check workflow structure and AI tool connections
- **`validate_workflow_expressions`** - Validate n8n expressions including $fromAI()
- **`get_property_dependencies`** - Analyze property visibility conditions
- **`get_node_documentation`** - Get parsed documentation from n8n-docs
- **`get_database_statistics`** - View database metrics and coverage

### Management Tools (Optional - Requires API Configuration)

These powerful tools allow you to manage n8n workflows directly from Claude. They're only available when you provide `N8N_API_URL` and `N8N_API_KEY` in your configuration.

#### Workflow Management

- **`n8n_create_workflow`** - Create new workflows with nodes and connections
- **`n8n_get_workflow`** - Get complete workflow by ID
- **`n8n_get_workflow_details`** - Get workflow with execution statistics
- **`n8n_get_workflow_structure`** - Get simplified workflow structure
- **`n8n_get_workflow_minimal`** - Get minimal workflow info (ID, name, active status)
- **`n8n_update_full_workflow`** - Update entire workflow (complete replacement)
- **`n8n_update_partial_workflow`** - Update workflow using diff operations (NEW in v2.7.0!)
- **`n8n_delete_workflow`** - Delete workflows permanently
- **`n8n_list_workflows`** - List workflows with filtering and pagination
- **`n8n_validate_workflow`** - Validate workflows already in n8n by ID (NEW in v2.6.3)

#### Execution Management

- **`n8n_trigger_webhook_workflow`** - Trigger workflows via webhook URL
- **`n8n_get_execution`** - Get execution details by ID
- **`n8n_list_executions`** - List executions with status filtering
- **`n8n_delete_execution`** - Delete execution records

#### System Tools

- **`n8n_health_check`** - Check n8n API connectivity and features
- **`n8n_diagnostic`** - Troubleshoot management tools visibility and configuration issues
- **`n8n_list_available_tools`** - List all available management tools

### Tips

- If you're running n8n locally, use `http://localhost:5678` as the N8N_API_URL
- The n8n API credentials are optional - without them, you'll have documentation and validation tools only
- With API credentials, you'll get full workflow management capabilities
- Use `--scope local` (default) to keep your API credentials private
- Use `--scope project` to share configuration with your team (put credentials in environment variables)
- Claude Code will automatically start the MCP server when you begin a conversation

## 🚀 Getting Started

Once everything is set up:

1. Open your project in VS Code
2. Open the integrated terminal
3. Run `claude`
4. Try a simple command like: "Explain the structure of this project"
5. Use `Cmd+Esc` / `Ctrl+Esc` for quick access going forward

For detailed usage examples and workflows, check the [official Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/quickstart).

## 📦 License

- See MIT [LICENSE](LICENSE) for details.

## 👏 Acknowledgments

- [Anthropic](https://anthropic.com) team for the Model Context Protocol
- [n8n](https://n8n.io) team for the workflow automation platform
- [n8n-MCP](https://github.com/czlonkowski/n8n-mcp/tree/main) community for the mcp server integration

## 🔍 Resources

- [Claude-Desktop n8n-MCP Tutorial](https://www.youtube.com/watch?v=5CccjiLLyaY&t=343s) walkthrough using the n8n-MCP through Claude Desktop
- [Claude-Code n8n-MCP Tutorial](https://www.youtube.com/watch?v=7LlQZKPBKgs) walkthrough using the n8n-MCP through Claude-Code in VSCode

## 💻 Support

**Need help?** Visit [support.anthropic.com](https://support.anthropic.com) for additional assistance or check the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code) for the most up-to-date information.
