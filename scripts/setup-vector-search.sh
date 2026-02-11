#!/bin/bash

set -e

echo "🔧 Setting up Vector Search for MongoDB..."
echo ""

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB..."
sleep 5

# Create the vector search index
echo "📊 Creating vector search index..."
mongosh "mongodb://mongodb:27017/sample_mflix" --quiet --eval '
db.movies.createSearchIndex(
  "vector_index",
  "vectorSearch",
  {
    fields: [
      {
        type: "vector",
        path: "plot_embedding",
        numDimensions: 768,
        similarity: "cosine"
      }
    ]
  }
);
print("✅ Vector search index created!");
'

echo ""
echo "✅ Vector search setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Generate embeddings for movie plots using Ollama"
echo "2. Insert embeddings into the plot_embedding field"
echo "3. Use vector search queries in n8n"
