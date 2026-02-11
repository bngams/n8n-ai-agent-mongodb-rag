# AI Agent Chat - Two Workflow Setup

## 🎯 Understanding the Architecture

The AI Agent needs **TWO separate workflows**:

1. **Main Workflow** - Contains Chat Trigger, AI Agent, Ollama Model
2. **Tool Sub-workflow** - Contains the vector search logic (called by AI Agent)

This is because n8n's `Tool Workflow` node references another workflow by ID.

## 📦 Files You Need

1. `n8n-workflows/vector-search-tool-subworkflow.json` - The tool (import first!)
2. `n8n-workflows/ai-agent-chat-simple.json` - The main chat (import second!)

## 🚀 Step-by-Step Setup

### Step 1: Import the Tool Sub-workflow

1. Open n8n: http://localhost:5678
2. Click **"Add workflow"**
3. Import `n8n-workflows/vector-search-tool-subworkflow.json`
4. **IMPORTANT**: Copy the workflow ID
   - Look at the URL: `http://localhost:5678/workflow/[THIS-IS-THE-ID]`
   - Or click workflow settings (gear icon) → "Workflow ID"
5. **Save** the workflow (Ctrl+S or Cmd+S)

### Step 2: Import the Main AI Agent Workflow

1. Click **"Add workflow"** again (new tab/workflow)
2. Import `n8n-workflows/ai-agent-chat-simple.json`
3. You'll see 4 nodes: Chat Trigger, AI Agent, Ollama Model, Vector Search Tool

### Step 3: Configure the Tool to Use Sub-workflow

1. Click on the **"Vector Search Tool"** node
2. Find the **"Workflow ID"** field
3. **Paste the ID** from Step 1
4. Click **"Save"**

### Step 4: Connect the Nodes

Now manually connect:

1. **Ollama Chat Model** → **AI Agent**
   - Drag from Ollama to the "Model" input on AI Agent

2. **Vector Search Tool** → **AI Agent**
   - Drag from Vector Search Tool to the "Tool" input on AI Agent

### Step 5: Test!

1. Click **"Test workflow"** or **"Execute Workflow"**
2. A chat URL will appear
3. Click it to open the chat
4. Ask: "Recommend a space movie"
5. Watch the AI use the tool! 🎉

## 📋 Complete Setup Checklist

```
[✓] Step 1: Import vector-search-tool-subworkflow.json
[✓] Step 2: Copy the workflow ID
[✓] Step 3: Save the tool sub-workflow
[✓] Step 4: Import ai-agent-chat-simple.json
[✓] Step 5: Paste workflow ID into Vector Search Tool node
[✓] Step 6: Connect Ollama Model → AI Agent (model)
[✓] Step 7: Connect Vector Search Tool → AI Agent (tool)
[✓] Step 8: Test the chat!
```

## 🔍 What Each Workflow Does

### Tool Sub-workflow (vector-search-tool-subworkflow.json)
```
Execute Workflow Trigger (receives query from AI Agent)
    ↓
Extract Query (get the search query)
    ↓
Get Embedding (convert to vector via Ollama)
    ↓
Fetch Movies (search MongoDB)
    ↓
Rank Results (calculate similarity, return top 3)
    ↓
Return to AI Agent
```

### Main Workflow (ai-agent-chat-simple.json)
```
Chat Trigger (user input)
    ↓
AI Agent (decides when to use tool)
    ├─→ Ollama Model (generates responses)
    └─→ Vector Search Tool (calls sub-workflow when needed)
```

## 🎯 How It Works in Action

**User**: "I want a space movie"

**AI Agent thinks**: "User wants movie recommendations, I should use searchMovies tool"

**AI Agent calls**: Tool Sub-workflow with query="space adventure"

**Tool Sub-workflow**:
- Converts "space adventure" to embedding
- Searches 100 movies
- Returns top 3 matches

**AI Agent receives**: Movie data

**AI Agent responds**: "I found some great space movies! Here are my top recommendations: 1. 2001: A Space Odyssey..."

## 🔧 Troubleshooting

### "Tool not found" or "Workflow not found"
**Fix**: Make sure you pasted the correct workflow ID in Step 3

### "Execution failed in sub-workflow"
**Fix**:
1. Open the tool sub-workflow
2. Click "Test workflow" directly
3. Check for errors in MongoDB connection or Ollama

### AI doesn't call the tool
**Fix**:
1. Check tool description is clear
2. Try more explicit queries: "Search for space movies" instead of "space"
3. Check temperature isn't too low (should be 0.7)

### MongoDB connection error in sub-workflow
**Fix**: Open tool sub-workflow, click MongoDB node, verify:
```
mongodb://mongodb:27017/?directConnection=true
```

## ✅ Quick Test for Tool Sub-workflow

Before testing the AI Agent, test the tool independently:

1. Open **vector-search-tool-subworkflow**
2. Click "Execute Workflow"
3. In the Execute Workflow Trigger node, add test data:
   ```json
   {
     "query": "space adventure"
   }
   ```
4. Should return 3 movie recommendations

If this works, the AI Agent will be able to call it!

## 📊 Workflow IDs Explained

**Why do we need IDs?**
- n8n stores workflows separately
- Tool Workflow node needs to know which workflow to call
- ID is the unique identifier for that workflow

**Where to find it?**
- URL bar: `http://localhost:5678/workflow/[ID-HERE]`
- Workflow settings: Gear icon → "Workflow ID"
- Workflow list: Shows ID in the details

## 💡 Pro Tips

1. **Name your workflows clearly**
   - Main: "AI Movie Chat"
   - Tool: "Vector Search Tool"

2. **Test the tool first**
   - Make sure vector search works before connecting to AI

3. **Save frequently**
   - Both workflows need to be saved

4. **Use execution logs**
   - Click on "Executions" to see what the AI is doing

5. **Tool description matters**
   - The AI reads the description to decide when to use it
   - Be clear: "Use this to search for movies..."

## 🎬 Alternative: Simple Manual Test

If the full setup is complex, you can test components individually:

2. **Test 2**: Set up tool sub-workflow and test it manually
3. **Test 3**: Connect everything for full AI agent

---

**Ready to start?** Follow the steps above and you'll have a working AI chat agent! 🚀
