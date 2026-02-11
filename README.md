# AI Agent with n8n, MongoDB, and Ollama (Local Setup)

This project implements a local version of MongoDB's AI Agent tutorial using n8n for workflow automation, MongoDB for data storage and vector search, and Ollama for running local LLM models (Mistral).

## 🎯 Overview

The setup allows you to:
- Ask natural language questions about the MongoDB `sample_mflix` database (movies, theaters, users, comments)
- Use RAG (Retrieval Augmented Generation) with vector search
- Store chat memory for contextual conversations
- Run everything locally with Docker

## 📋 Prerequisites

- Docker and Docker Compose installed
- At least 8GB RAM available
- 10GB disk space for models and data

## 🚀 Quick Start

### 1. Start all services

```bash
docker-compose up -d
```

This will start:
- **MongoDB** (port 27017) - Database with sample_mflix data
- **n8n** (port 5678) - Workflow automation platform
- **Ollama** (port 11434) - Local LLM service
- **mongodb-loader** - One-time container to load sample data
- **ollama-init** - One-time container to pull Mistral models

### 2. Wait for initialization

The first startup will take 5-10 minutes as it:
- Downloads Mistral models (~2.5GB for mistral:7b-instruct-q4_0 quantized)
- Downloads nomic-embed-text for embeddings (~274MB)
- Loads sample_mflix dataset (~200k documents)

Monitor progress:
```bash
# Watch Ollama model download
docker logs -f ollama-init

# Watch MongoDB data loading
docker logs -f mongodb-loader
```

### 3. Access the services

- **n8n UI**: http://localhost:5678
  - Username: `admin`
  - Password: `admin123`

- **MongoDB**: `mongodb://admin:admin123@localhost:27017`

- **Ollama API**: http://localhost:11434

## 🎬 Sample Data: sample_mflix

The database includes:
- **movies** (~23k documents) - Movie details, plots, ratings, genres
- **comments** (~50k documents) - User comments on movies
- **users** (~184 documents) - User profiles
- **theaters** (~1.5k documents) - Theater locations
- **sessions** - User sessions

Example questions you can ask the AI agent:
- "What are the top rated action movies from 1995?"
- "Tell me about movies directed by Christopher Nolan"
- "What theaters are in New York?"
- "Which movies have the most comments?"

## 🤖 Setting up n8n Workflow

### 1. Create a new workflow in n8n

### 2. Add these nodes:

#### A. Chat Trigger Node
- Trigger: **Chat Trigger**
- Configure: Enable public access or use webhook

#### B. Ollama Chat Model Node
- Node: **Ollama Chat Model**
- Configuration:
  - Base URL: `http://ollama:11434`
  - Model: `mistral:7b-instruct-q4_0`
  - Temperature: `0.7`

#### C. MongoDB Atlas Vector Store Node
- Node: **MongoDB Atlas Vector Store**
- Configuration:
  - Connection String: `mongodb://admin:admin123@mongodb:27017/sample_mflix?authSource=admin`
  - Database: `sample_mflix`
  - Collection: `movies`
  - Embedding Model: Use Ollama with `nomic-embed-text`
  - Embeddings URL: `http://ollama:11434`

#### D. MongoDB Chat Memory Node
- Node: **MongoDB Chat Memory**
- Configuration:
  - Connection String: `mongodb://admin:admin123@mongodb:27017/sample_mflix?authSource=admin`
  - Database: `sample_mflix`
  - Collection: `chat_memory`

#### E. AI Agent Node
- Node: **AI Agent**
- Configuration:
  - Connect Chat Model (Ollama)
  - Connect Vector Store (for RAG)
  - Connect Chat Memory (for context)

### 3. Alternative: Direct MongoDB Query

For asking questions about the database schema or querying data directly:

#### A. MongoDB Node
- Node: **MongoDB**
- Configuration:
  - Connection String: `mongodb://admin:admin123@mongodb:27017`
  - Database: `sample_mflix`
  - Operation: Find, Aggregate, etc.

## 🔧 Configuration

### Using Ollama with n8n

When configuring Ollama in n8n nodes, use:
- **Host**: `http://ollama:11434` (from within Docker network)
- **Model for Chat**: `mistral:7b-instruct-q4_0`
- **Model for Embeddings**: `nomic-embed-text`

### MongoDB Connection

Use this connection string in n8n:
```
mongodb://admin:admin123@mongodb:27017/sample_mflix?authSource=admin
```

## 📊 Verify Installation

### Check MongoDB data

```bash
docker exec -it mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# In mongosh:
use sample_mflix
db.movies.countDocuments()
db.movies.findOne()
show collections
```

### Check Ollama models

```bash
docker exec -it ollama ollama list
```

Should show:
- `mistral:7b-instruct-q4_0`
- `nomic-embed-text`

### Test Ollama

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "mistral:7b-instruct-q4_0",
  "prompt": "What is MongoDB?"
}'
```

## 🛠️ Troubleshooting

### Ollama can't download models

If you don't have GPU:
1. Edit [docker-compose.yml](docker-compose.yml)
2. Comment out the `deploy` section under `ollama` service
3. Restart: `docker-compose up -d`

### MongoDB data not loading

```bash
# Manually trigger data load
docker-compose up mongodb-loader
```

### n8n can't connect to MongoDB or Ollama

Make sure all services are on the same network:
```bash
docker network inspect demo-n8n-mongo_n8n-network
```

### Out of memory

Mistral 7B requires ~4-6GB RAM. Consider:
- Using `mistral:7b-instruct-q4_0` (quantized, smaller)
- Or `llama3.2:3b` (lighter model)

To change model:
```bash
docker exec -it ollama ollama pull mistral:7b-instruct-q4_0
```

## 🧹 Cleanup

Stop and remove all containers:
```bash
docker-compose down
```

Remove data volumes (⚠️ deletes all data):
```bash
docker-compose down -v
```

## 📚 Resources

- [MongoDB Atlas AI Agent Tutorial](https://www.mongodb.com/docs/atlas/ai-integrations/n8n/build-ai-agent/)
- [n8n Documentation](https://docs.n8n.io/)
- [Ollama Models](https://ollama.com/library)
- [MongoDB sample_mflix Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/)

## 🎯 Quick Start with AI Agent

✅ **100 movies with embeddings** are ready to use!
✅ **4 n8n workflows** ready to import
✅ **Complete documentation** with examples

### Get Started:

1. **Import AI Agent workflows**: [AI-AGENT-TWO-WORKFLOW-SETUP.md](AI-AGENT-TWO-WORKFLOW-SETUP.md) ⭐ **START HERE**
2. **Alternative workflows**: [IMPORT-WORKFLOWS.md](IMPORT-WORKFLOWS.md)
3. **Quick reference**: [QUICK-REFERENCE.md](QUICK-REFERENCE.md)

### Available Workflows:

All workflows are in the [n8n-workflows/](n8n-workflows/) folder:
- **ai-agent-chat-simple.json** - AI Chat Agent (main workflow) ⭐ **RECOMMENDED**
- **vector-search-tool-subworkflow.json** - Vector Search Tool (required sub-workflow)

## 🔐 Security Notes

⚠️ **This setup is for local development only!**

Default credentials are:
- MongoDB: `admin/admin123`
- n8n: `admin/admin123`

Change these before deploying anywhere accessible from the internet.

## 💡 Tips

- Use smaller models for faster responses: `mistral:7b-instruct-q4_0`
- Adjust temperature (0-1) for creativity vs. accuracy
- The first query may be slow as models load into memory
- Monitor Docker logs for debugging: `docker-compose logs -f`
