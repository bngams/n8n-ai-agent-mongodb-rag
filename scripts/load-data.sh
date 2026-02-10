#!/bin/bash

set -e

echo "⏳ Waiting for MongoDB to be ready..."
sleep 10

echo "📥 Downloading sample_mflix dataset..."

# Create temp directory
mkdir -p /tmp/sample_data
cd /tmp/sample_data

# Download sample_mflix collections from MongoDB sample dataset repository
BASE_URL="https://raw.githubusercontent.com/neelabalan/mongodb-sample-dataset/main/sample_mflix"

echo "Downloading comments..."
curl -L -o comments.json "${BASE_URL}/comments.json" 2>/dev/null || echo "Failed to download comments"

echo "Downloading movies..."
curl -L -o movies.json "${BASE_URL}/movies.json" 2>/dev/null || echo "Failed to download movies"

echo "Downloading theaters..."
curl -L -o theaters.json "${BASE_URL}/theaters.json" 2>/dev/null || echo "Failed to download theaters"

echo "Downloading users..."
curl -L -o users.json "${BASE_URL}/users.json" 2>/dev/null || echo "Failed to download users"

echo "Downloading sessions..."
curl -L -o sessions.json "${BASE_URL}/sessions.json" 2>/dev/null || echo "Failed to download sessions"

echo ""
echo "📦 Loading data into MongoDB..."

# Import each collection
if [ -f comments.json ]; then
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=comments --file=comments.json --jsonArray 2>/dev/null || \
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=comments --file=comments.json
  echo "✅ Comments loaded"
fi

if [ -f movies.json ]; then
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=movies --file=movies.json --jsonArray 2>/dev/null || \
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=movies --file=movies.json
  echo "✅ Movies loaded"
fi

if [ -f theaters.json ]; then
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=theaters --file=theaters.json --jsonArray 2>/dev/null || \
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=theaters --file=theaters.json
  echo "✅ Theaters loaded"
fi

if [ -f users.json ]; then
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=users --file=users.json --jsonArray 2>/dev/null || \
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=users --file=users.json
  echo "✅ Users loaded"
fi

if [ -f sessions.json ]; then
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=sessions --file=sessions.json --jsonArray 2>/dev/null || \
  mongoimport --uri="mongodb://mongodb:27017/sample_mflix" --collection=sessions --file=sessions.json
  echo "✅ Sessions loaded"
fi

echo ""
echo "🔍 Creating indexes..."
mongosh "mongodb://mongodb:27017/sample_mflix" --quiet --eval "
  db.movies.createIndex({ 'title': 1 });
  db.movies.createIndex({ 'year': 1 });
  db.movies.createIndex({ 'genres': 1 });
  db.movies.createIndex({ 'imdb.rating': -1 });
  db.comments.createIndex({ 'movie_id': 1 });
  db.comments.createIndex({ 'email': 1 });
  db.theaters.createIndex({ 'location.geo': '2dsphere' });
  print('✅ Indexes created');
  print('');
  print('📊 Database Statistics:');
  print('Movies:', db.movies.countDocuments());
  print('Comments:', db.comments.countDocuments());
  print('Users:', db.users.countDocuments());
  print('Theaters:', db.theaters.countDocuments());
  print('Sessions:', db.sessions.countDocuments());
"

# Clean up
cd /
rm -rf /tmp/sample_data

echo ""
echo "✅ sample_mflix dataset loaded successfully!"
echo "🎬 You can now query the database and ask questions about movies!"
