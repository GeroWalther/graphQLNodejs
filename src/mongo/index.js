import { MongoClient, ServerApiVersion } from 'mongodb';
const uri =
  'mongodb+srv://Schnecke44:Schnecke44@cluster0.r219gfw.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function setupDatabase() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const mFlixDb = client.db('sample_mflix');
    const mFlixusers = mFlixDb.collection('users');
    const mFlixmovieCollection = mFlixDb.collection('movies');
    const comments = mFlixDb.collection('comments');

    // Send a ping to confirm a successful connection
    return {
      client,
      mFlixDb,
      mFlixusers,
      mFlixmovieCollection,
      comments,
    };
  } catch (e) {
    console.log('Error connecting to MongoDB', e);
    return {};
  }
}
