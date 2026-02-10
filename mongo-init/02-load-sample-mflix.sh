#!/bin/bash

# Script to download and load sample_mflix dataset from MongoDB sample datasets
# This will be executed inside the MongoDB container

echo "📥 Downloading sample_mflix dataset..."

# Create temp directory
mkdir -p /tmp/sample_data
cd /tmp/sample_data

# Download sample_mflix collections from MongoDB sample dataset repository
BASE_URL="https://raw.githubusercontent.com/neelabalan/mongodb-sample-dataset/main/sample_mflix"

# Download each collection
curl -L -o comments.json "${BASE_URL}/comments.json"
curl -L -o movies.json "${BASE_URL}/movies.json"
curl -L -o theaters.json "${BASE_URL}/theaters.json"
curl -L -o users.json "${BASE_URL}/users.json"
curl -L -o sessions.json "${BASE_URL}/sessions.json"

echo "📦 Loading data into MongoDB..."

# Import each collection
mongoimport --uri="mongodb://localhost:27017/sample_mflix" --collection=comments --file=comments.json
mongoimport --uri="mongodb://localhost:27017/sample_mflix" --collection=movies --file=movies.json
mongoimport --uri="mongodb://localhost:27017/sample_mflix" --collection=theaters --file=theaters.json
mongoimport --uri="mongodb://localhost:27017/sample_mflix" --collection=users --file=users.json
mongoimport --uri="mongodb://localhost:27017/sample_mflix" --collection=sessions --file=sessions.json

# Clean up
cd /
rm -rf /tmp/sample_data

echo "✅ sample_mflix dataset loaded successfully!"
