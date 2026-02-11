# Import n8n Workflows

## 📦 Available Workflows

All workflows are located in the [n8n-workflows/](n8n-workflows/) folder.

### 1. **AI Chat Agent** (2 files) ⭐ **RECOMMENDED**

**Requires TWO workflows** - import in this order:
1. `n8n-workflows/vector-search-tool-subworkflow.json` - The search tool (import FIRST!)
2. `n8n-workflows/ai-agent-chat-simple.json` - The main chat (import SECOND!)

**Features**:
- 💬 Chat UI built-in
- 🤖 AI automatically searches movies when needed
- 🧠 Uses Ollama Llama 3.2 for intelligent responses
- 🔍 Vector search integrated as a tool

⚠️ **Important**: Follow the complete setup guide → **[AI-AGENT-TWO-WORKFLOW-SETUP.md](AI-AGENT-TWO-WORKFLOW-SETUP.md)**

## 🚀 How to Import

### Step 1: Access n8n
1. Open http://localhost:5678
2. Login: `admin` / `admin123`

### Step 2: Import Workflow

**Option A: Drag & Drop (Easiest)**
1. In n8n, click **"Add workflow"** (top right)
2. Drag the `.json` file into the browser window
3. Done! 🎉

**Option B: Copy-Paste**
1. Click **"Add workflow"** → **"Import from File"**
2. Open the `.json` file in a text editor
3. Copy all content (Cmd+A, Cmd+C)
4. Paste into n8n
5. Click **"Import"**

**Option C: File Upload**
1. Click **"Add workflow"** → **"Import from File"**
2. Click **"Select file"**
3. Navigate to `n8n-workflows/` folder
4. Choose the workflow file you want to import
5. Click **"Import"**

## 🧪 Test the Simple Workflow

### After Import:

1. You'll see 5 nodes connected in a flow
2. Click **"Execute Workflow"** button (top right)
3. Watch each node process
4. See results in the last node

### Customize the Query:

1. Click on the **"Set Search Query"** node
2. Change the value in the `query` field:
   - Try: `"space adventure with aliens"`
   - Try: `"romantic comedy"`
   - Try: `"detective solving a mystery"`
3. Click **"Execute Workflow"** again

## 🌐 Use the API Workflow

### After Import:

1. The workflow shows a webhook URL
2. Click **"Execute Workflow"** to activate
3. Copy the webhook URL (looks like: `http://localhost:5678/webhook/search-movies`)

### Test with curl:

```bash
curl -X POST http://localhost:5678/webhook/search-movies \
  -H "Content-Type: application/json" \
  -d '{"query": "A hero saves the world from evil"}'
```

### Test with Postman:
- **Method**: POST
- **URL**: `http://localhost:5678/webhook/search-movies`
- **Body** (raw JSON):
```json
{
  "query": "space exploration and alien encounters"
}
```

### Response Format:
```json
{
  "query": "your search query",
  "total_movies_searched": 100,
  "results": [
    {
      "title": "Movie Title",
      "plot": "Plot description...",
      "year": 2000,
      "genres": ["Action", "Sci-Fi"],
      "cast": ["Actor 1", "Actor 2"],
      "directors": ["Director Name"],
      "similarity": 0.85,
      "similarity_percent": "85%"
    }
  ]
}
```

## 🔧 Troubleshooting

### "MongoDB node failed"
**Fix**: Check MongoDB connection in the node
- Click the MongoDB node
- Configuration Type: `Connection String`
- Connection String: `mongodb://mongodb:27017/?directConnection=true`
- Database: `sample_mflix`
- Collection: `embedded_movies`

### "HTTP Request failed" (Ollama)
**Fix**: Make sure Ollama is running
```bash
docker-compose ps ollama
# Should show "healthy"

# If not, restart:
docker-compose restart ollama
```

### "No results" or empty output
**Fix**: Verify embeddings exist
```bash
docker exec mongodb mongosh --eval "
  db.getSiblingDB('sample_mflix').embedded_movies.countDocuments()
"
# Should show: 100
```

If 0, regenerate embeddings:
```bash
docker-compose up embedding-generator
```

## ✏️ Customize the Workflows

### Change the number of results:

In the **Code node**, find this line:
```javascript
.slice(0, 5);  // Change 5 to any number
```

### Add filters (e.g., year):

In the **Code node**, before calculating similarity:
```javascript
// Filter movies by year
const filteredMovies = movies.filter(movie => {
  const year = movie.json.year;
  return year && year > 2000;  // Only movies after 2000
});

// Then use filteredMovies instead of movies
const results = filteredMovies.map(movie => {
  // ... rest of the code
```

### Add genre filtering:

```javascript
const filteredMovies = movies.filter(movie => {
  const genres = movie.json.genres || [];
  return genres.includes('Action');  // Only action movies
});
```

## 💬 Use the AI Chat Agent Workflow

### ⚠️ Important: Connect the Nodes First!

After importing, you need to **manually connect**:

1. **Ollama Chat Model** → **AI Agent** (drag to the "Model" input)
2. **Vector Search Tool** → **AI Agent** (drag to the "Tool" input)

See detailed instructions: **[AI-AGENT-SETUP-NOTES.md](AI-AGENT-SETUP-NOTES.md)**

### After Import and Connections:

1. Import `n8n-workflows/vector-search-tool-subworkflow.json` first
2. Import `n8n-workflows/ai-agent-chat-simple.json` second
3. Connect the workflow ID as described in [AI-AGENT-TWO-WORKFLOW-SETUP.md](AI-AGENT-TWO-WORKFLOW-SETUP.md)
4. Click **"Execute Workflow"** (or use "Test workflow" button)
5. A chat URL will appear - click it to open the chat interface
6. Start chatting with the AI!

### Example Conversations:

**User**: "Recommend me a movie about space exploration"
**AI**: *The AI will automatically search the vector database and recommend movies like "2001: A Space Odyssey" or "Interstellar" with details*

**User**: "Tell me more about the first one"
**AI**: *Provides details from the movie data*

**User**: "Any similar movies?"
**AI**: *Searches again for similar themes*

### How It Works:

1. **Chat Trigger** - Provides the chat UI
2. **AI Agent** - Orchestrates the conversation
3. **Ollama Model** - Generates intelligent responses
4. **Vector Search Tool** - Automatically called when needed
   - Converts query to embedding
   - Searches MongoDB
   - Returns top 3 matches
   - Formats results for AI

### Chat Features:

- Natural conversation flow
- Context-aware responses
- Automatic movie search when relevant
- Detailed movie information from database

## 📊 Example Queries

Try these in the workflows:

| Query | Expected Results |
|-------|------------------|
| "Two people fall in love" | Romance movies |
| "A detective solves a crime" | Mystery/thriller movies |
| "Space exploration" | Sci-fi movies |
| "Funny situations and jokes" | Comedy movies |
| "Person discovers superpowers" | Superhero movies |
| "Journey to find treasure" | Adventure movies |

## 🎯 Next Steps

1. ✅ Import both workflows
2. ✅ Test the simple workflow first
3. ✅ Try different queries
4. ✅ Activate the API workflow
5. ✅ Test with curl or Postman
6. ✅ Customize to your needs!

## 📚 More Resources

- **Quick Reference**: [QUICK-REFERENCE.md](QUICK-REFERENCE.md)
- **n8n Docs**: https://docs.n8n.io

---

**Need help?** All workflows are pre-configured and should work out of the box! Just import and click "Execute Workflow" 🚀
