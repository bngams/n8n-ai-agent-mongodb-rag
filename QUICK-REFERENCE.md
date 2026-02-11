# Quick Reference Card

## 🔗 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **n8n** | http://localhost:5678 | admin / admin123 |
| **MongoDB** | mongodb://localhost:27017 | No auth |
| **Ollama** | http://localhost:11434 | - |
| **MongoDB Compass** | localhost:27017 | Direct connection |

## 📦 What's in Your Database

| Collection | Records | Description |
|------------|---------|-------------|
| `movies` | 23,539 | Original movie data |
| `comments` | 50,304 | User comments |
| `embedded_movies` | 100 | Movies with vector embeddings |

## 🔌 n8n MongoDB Connection

```
Connection String: mongodb://mongodb:27017/?directConnection=true
Database: sample_mflix
Collection: embedded_movies
```

## 🧠 Ollama Endpoints

### Get Embedding
```bash
POST http://ollama:11434/api/embeddings
{
  "model": "nomic-embed-text",
  "prompt": "your text here"
}
```

### Generate Text (Chat)
```bash
POST http://ollama:11434/api/generate
{
  "model": "llama3.2",
  "prompt": "your prompt",
  "stream": false
}
```

## 🔍 Quick Vector Search (Code Node)

```javascript
const queryEmbedding = $('HTTP Request').item.json.embedding;
const movies = $('MongoDB').all();

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

return movies
  .map(m => ({
    json: {
      title: m.json.title,
      plot: m.json.plot,
      similarity: cosineSimilarity(queryEmbedding, m.json.plot_embedding)
    }
  }))
  .sort((a, b) => b.json.similarity - a.json.similarity)
  .slice(0, 5);
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service]

# Restart a service
docker-compose restart [service]

# Check status
docker-compose ps

# Generate more embeddings
docker-compose up embedding-generator
```

## 🧪 Test Commands

### MongoDB
```bash
# Count movies with embeddings
docker exec mongodb mongosh --eval "
  db.getSiblingDB('sample_mflix').embedded_movies.countDocuments()
"

# View sample movie
docker exec mongodb mongosh --eval "
  db.getSiblingDB('sample_mflix').embedded_movies.findOne({}, {title:1, plot:1})
"
```

### Ollama
```bash
# List models
docker exec ollama ollama list

# Test embedding
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "test"
}'
```

## 📁 Project Structure

```
demo-n8n-mongo/
├── docker-compose.yml                   # All services
├── n8n-workflows/                        # n8n workflow files
│   ├── ai-agent-chat-simple.json        # AI Chat Agent
│   └── vector-search-tool-subworkflow.json  # Search tool
├── scripts/
│   ├── generate-embeddings.py           # Create embeddings
│   └── load-data.sh                     # Load sample data
└── mongo-init/                          # MongoDB init scripts
```

## 🤖 AI Models Available

| Model | Purpose | Used In |
|-------|---------|---------|
| `llama3.2` | Chat & AI Agent (supports tools) | AI Chat Agent |
| `nomic-embed-text` | Generate embeddings (768-dim) | Vector Search |

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| Can't connect to MongoDB | Use `mongodb://mongodb:27017/?directConnection=true` |
| Ollama not responding | `docker-compose restart ollama` |
| No embeddings | Run `docker-compose up embedding-generator` |
| n8n can't reach services | Use service names: `mongodb`, `ollama` (not `localhost`) |

## 📚 Documentation

- **Main Guide**: [README.md](README.md)
- **AI Agent Setup**: [AI-AGENT-TWO-WORKFLOW-SETUP.md](AI-AGENT-TWO-WORKFLOW-SETUP.md)
- **Import Workflows**: [IMPORT-WORKFLOWS.md](IMPORT-WORKFLOWS.md)
