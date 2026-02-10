# 🚀 Quick Start Guide

## Step 1: Start Everything

```bash
docker-compose up -d
```

Wait 5-10 minutes for initial setup (models download, data loads).

## Step 2: Monitor Progress

```bash
# Watch Ollama downloading Mistral (~4GB)
docker logs -f ollama-init

# Watch MongoDB loading sample_mflix data
docker logs -f mongodb-loader
```

Press `Ctrl+C` to stop watching logs.

## Step 3: Verify Services

### Check all containers are running:
```bash
docker-compose ps
```

You should see:
- ✅ mongodb (healthy)
- ✅ n8n (running)
- ✅ ollama (running)
- ✅ mongodb-loader (exited 0) - this is normal
- ✅ ollama-init (exited 0) - this is normal

### Check data is loaded:
```bash
docker exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.getSiblingDB('sample_mflix').movies.countDocuments()"
```

Should return a number around 23,000 movies.

### Check Ollama models:
```bash
docker exec ollama ollama list
```

Should show `mistral:7b-instruct-q4_0` and `nomic-embed-text`.

## Step 4: Access n8n

1. Open browser: http://localhost:5678
2. Login:
   - Username: `admin`
   - Password: `admin123`

## Step 5: Create Your First AI Agent Workflow

### Simple Movie Query Agent

1. **Click "Create New Workflow"**

2. **Add Chat Trigger**:
   - Search for "Chat Trigger"
   - Add it to canvas
   - Enable public access

3. **Add Ollama Chat Model**:
   - Search for "Ollama Chat Model"
   - Connect to Chat Trigger
   - Configure:
     - Base URL: `http://ollama:11434`
     - Model Name: `mistral:7b-instruct-q4_0`

4. **Add MongoDB Node** (for simple queries):
   - Search for "MongoDB"
   - Configure:
     - Connection: `mongodb://admin:admin123@mongodb:27017`
     - Database: `sample_mflix`
     - Collection: `movies`
     - Operation: `Find`

5. **Add AI Agent** (advanced):
   - Search for "AI Agent"
   - Connect the Ollama model
   - Add tools (MongoDB operations)

6. **Save and Test**:
   - Click "Save"
   - Click "Test Workflow"
   - Try asking: "What are the highest rated movies?"

## Example Questions to Ask

Once your agent is set up:

- "What are the top 5 rated action movies?"
- "Tell me about movies from 1994"
- "Which movies are in the drama genre?"
- "How many theaters are there in California?"
- "Show me comedies with high ratings"

## 🎯 What's Next?

- Check [README.md](README.md) for detailed workflow setup
- Explore the sample_mflix database structure
- Try different Ollama models
- Build RAG workflows with vector search

## 🆘 Need Help?

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs mongodb
docker-compose logs n8n
docker-compose logs ollama

# Restart everything
docker-compose restart

# Stop everything
docker-compose down
```

## 🧪 Test Ollama Directly

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "mistral:7b-instruct-q4_0",
  "prompt": "Explain what MongoDB is in one sentence.",
  "stream": false
}'
```

## 📊 Explore the Database

```bash
# Connect to MongoDB
docker exec -it mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Inside mongosh:
use sample_mflix
show collections
db.movies.findOne()
db.movies.aggregate([
  { $group: { _id: "$year", count: { $sum: 1 } } },
  { $sort: { _id: -1 } },
  { $limit: 10 }
])
```

That's it! You're ready to build AI agents locally! 🎉
