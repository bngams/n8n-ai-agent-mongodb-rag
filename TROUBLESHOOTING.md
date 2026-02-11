# Troubleshooting Guide

## Error: "The workflow did not return a response"

This error occurs when the Vector Search Tool sub-workflow doesn't return data in the expected format.

### Quick Fixes:

#### 1. Test the Sub-workflow Directly

1. Open **"Vector Search Tool (Sub-workflow)"** in n8n
2. Click the **"Execute Workflow Trigger"** node
3. Click **"Test workflow"**
4. In the trigger node settings, add test input:
   ```json
   {
     "query": "space adventure"
   }
   ```
5. Run the workflow
6. Check if all nodes execute successfully and produce output

#### 2. Verify Workflow ID Connection

1. Open **"AI Agent Movie Chat"** workflow
2. Click on **"Vector Search Tool"** node
3. Check that **"Workflow ID"** field contains the correct ID
4. To get the ID:
   - Open the sub-workflow
   - Look at the URL: `http://localhost:5678/workflow/[COPY-THIS-ID]`
   - Or click settings (gear icon) → "Workflow ID"

#### 3. Check MongoDB Connection

The sub-workflow needs to fetch movies from MongoDB:

```bash
# Verify movies with embeddings exist
docker exec mongodb mongosh --eval "
  db.getSiblingDB('sample_mflix').embedded_movies.countDocuments()
"
```

Should return `100`.

#### 4. Check Ollama is Running

```bash
# Test embedding endpoint
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "test"
}'
```

Should return a JSON response with an `embedding` array.

## Error: "Received tool input did not match expected schema"

This means the AI Agent is sending data in a format the tool doesn't expect.

### Fix:

1. Open **"AI Agent Movie Chat"** workflow
2. Click **"Vector Search Tool"** node
3. Verify the **Input Schema** section has:
   - Name: `query`
   - Type: `string`
   - Required: ✓ checked

## Error: "No parameters are set up to be filled by AI"

This appears when testing the Tool Workflow node directly.

### Fix:

This is normal! The Tool Workflow node is designed to be called by the AI Agent, not executed directly. Test the full chat workflow instead.

## AI Doesn't Use the Tool

If the AI responds without searching for movies:

### Fixes:

1. **Check Tool Description**: Make sure it clearly states when to use it
   ```
   Search for movies using semantic/vector search. Use this when the user asks for movie recommendations or wants to find movies matching a description.
   ```

2. **Use More Explicit Queries**: Try:
   - ✅ "Search for space movies"
   - ✅ "Find me action movies"
   - ❌ "space" (too vague)

3. **Check Model**: Ensure you're using `llama3.2` (supports tools), not `mistral:7b-instruct-q4_0`

## Workflow Executions Show Errors

### Check Execution Logs:

1. In n8n, click **"Executions"** (left sidebar)
2. Find the failed execution
3. Click to open it
4. Check which node failed and read the error message

### Common Issues:

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot connect to MongoDB" | Wrong connection string | Use `mongodb://mongodb:27017/?directConnection=true` |
| "Cannot reach Ollama" | Ollama not running | `docker-compose restart ollama` |
| "embedding is undefined" | Ollama response format changed | Check if Ollama API is working |
| "plot_embedding is undefined" | No embeddings in database | Run `docker-compose up embedding-generator` |

## Still Having Issues?

### Full Reset:

```bash
# Stop everything
docker-compose down

# Start fresh
docker-compose up -d

# Wait 5 minutes for models to download
docker logs -f ollama-init

# Check all services are running
docker-compose ps

# Re-import workflows in n8n
```

### Enable Debug Mode:

1. In the sub-workflow Code node, add more logging:
   ```javascript
   console.log('Query:', query);
   console.log('Embedding length:', queryEmbedding.length);
   console.log('Movies found:', movies.length);
   console.log('Top result:', topResults[0]);
   ```

2. Check n8n execution logs to see these messages

### Check Docker Services:

```bash
# All containers should be "Up"
docker-compose ps

# Check logs for errors
docker-compose logs ollama
docker-compose logs mongodb
docker-compose logs n8n
```
