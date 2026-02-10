// Create vector search index for movies collection
db = db.getSiblingDB('sample_mflix');

// This creates a vector search index on the movies collection
// Note: This requires MongoDB 7.0+ with Atlas Search or MongoDB Enterprise
try {
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
        },
        {
          type: "filter",
          path: "genres"
        },
        {
          type: "filter",
          path: "year"
        }
      ]
    }
  );

  print('✅ Vector search index created on movies collection');
} catch (e) {
  print('ℹ️  Vector search index creation skipped - requires Atlas or Enterprise with Search');
  print('   You can still use the database for querying, but vector search will not be available');
}

// Create regular indexes for better query performance
db.movies.createIndex({ "title": 1 });
db.movies.createIndex({ "year": 1 });
db.movies.createIndex({ "genres": 1 });
db.movies.createIndex({ "imdb.rating": -1 });
db.comments.createIndex({ "movie_id": 1 });
db.comments.createIndex({ "email": 1 });
db.theaters.createIndex({ "location.geo": "2dsphere" });

print('✅ Regular indexes created successfully');
print('');
print('📊 Database Statistics:');
print('Movies:', db.movies.countDocuments());
print('Comments:', db.comments.countDocuments());
print('Users:', db.users.countDocuments());
print('Theaters:', db.theaters.countDocuments());
print('Sessions:', db.sessions.countDocuments());
