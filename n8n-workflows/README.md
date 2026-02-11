# n8n Workflows

This folder contains the AI Movie Chat Agent workflows.

## 📦 Files (Import in order)

1. **vector-search-tool-subworkflow.json** - Vector Search Tool (import FIRST)
2. **ai-agent-chat-simple.json** - AI Chat Agent (import SECOND)

## 🚀 Setup

Follow the complete setup guide: [AI-AGENT-TWO-WORKFLOW-SETUP.md](../AI-AGENT-TWO-WORKFLOW-SETUP.md)

**Quick steps:**
1. Start Docker: `docker-compose up -d`
2. Access n8n: http://localhost:5678 (login: admin/admin123)
3. Import `vector-search-tool-subworkflow.json` first
4. Copy its workflow ID
5. Import `ai-agent-chat-simple.json`
6. Paste the workflow ID into the Vector Search Tool node
7. Connect nodes and test!

## 📖 Documentation

- [AI-AGENT-TWO-WORKFLOW-SETUP.md](../AI-AGENT-TWO-WORKFLOW-SETUP.md) - Complete setup
- [QUICK-REFERENCE.md](../QUICK-REFERENCE.md) - Quick commands
