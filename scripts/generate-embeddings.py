#!/usr/bin/env python3
"""
Generate embeddings for movie plots using Ollama and store in MongoDB
"""

import requests
import json
from pymongo import MongoClient
from tqdm import tqdm
import time

# Configuration
OLLAMA_URL = "http://ollama:11434"
MONGO_URI = "mongodb://mongodb:27017"
DATABASE = "sample_mflix"
SOURCE_COLLECTION = "movies"
TARGET_COLLECTION = "embedded_movies"
EMBEDDING_MODEL = "nomic-embed-text"
BATCH_SIZE = 10
LIMIT = 100  # Process first 100 movies with plots

def get_embedding(text):
    """Get embedding from Ollama"""
    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/embeddings",
            json={
                "model": EMBEDDING_MODEL,
                "prompt": text
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()["embedding"]
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return None

def main():
    print("🚀 Starting embedding generation...")
    print(f"📡 Connecting to MongoDB at {MONGO_URI}")

    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client[DATABASE]

    # Get source and target collections
    source = db[SOURCE_COLLECTION]
    target = db[TARGET_COLLECTION]

    # Drop and recreate target collection
    print(f"🗑️  Dropping existing {TARGET_COLLECTION} collection...")
    target.drop()

    # Find movies with plots
    print(f"📊 Finding movies with plots (limit: {LIMIT})...")
    movies_cursor = source.find(
        {"plot": {"$exists": True, "$ne": None, "$ne": ""}},
        {"title": 1, "plot": 1, "year": 1, "genres": 1, "cast": 1, "directors": 1}
    ).limit(LIMIT)

    movies = list(movies_cursor)
    print(f"✅ Found {len(movies)} movies with plots")

    if len(movies) == 0:
        print("❌ No movies found with plots!")
        return

    # Process movies
    print(f"🔄 Generating embeddings for {len(movies)} movies...")
    processed = 0
    failed = 0

    for movie in tqdm(movies, desc="Processing movies"):
        try:
            # Get embedding for plot
            plot = movie.get("plot", "")
            if not plot:
                continue

            embedding = get_embedding(plot)
            if embedding is None:
                failed += 1
                continue

            # Create document with embedding
            doc = {
                "_id": movie["_id"],
                "title": movie.get("title"),
                "plot": plot,
                "year": movie.get("year"),
                "genres": movie.get("genres", []),
                "cast": movie.get("cast", []),
                "directors": movie.get("directors", []),
                "plot_embedding": embedding
            }

            # Insert into target collection
            target.insert_one(doc)
            processed += 1

            # Small delay to avoid overwhelming Ollama
            time.sleep(0.1)

        except Exception as e:
            print(f"\n❌ Error processing movie '{movie.get('title', 'Unknown')}': {e}")
            failed += 1

    print(f"\n✅ Successfully processed {processed} movies")
    if failed > 0:
        print(f"⚠️  Failed to process {failed} movies")

    # Create vector search index
    print("\n📊 Creating vector search index...")
    try:
        target.create_search_index(
            {
                "name": "vector_index",
                "type": "vectorSearch",
                "definition": {
                    "fields": [
                        {
                            "type": "vector",
                            "path": "plot_embedding",
                            "numDimensions": len(embedding),
                            "similarity": "cosine"
                        }
                    ]
                }
            }
        )
        print("✅ Vector search index created!")
    except Exception as e:
        print(f"⚠️  Could not create search index (may already exist): {e}")

    print(f"\n🎉 Setup complete!")
    print(f"📝 Collection '{TARGET_COLLECTION}' now contains {processed} movies with embeddings")
    print(f"🔍 You can now perform vector searches in n8n!")

if __name__ == "__main__":
    main()
