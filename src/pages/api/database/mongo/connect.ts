import url from 'url';
import { MongoClient, Db } from 'mongodb';

export default null;
export { GetCurrentDbCollection };

let cachedDb: Db = null;

async function ConnectToDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const { MONGODB_URI: uri } = process.env;

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = url.parse(uri).pathname.slice(1);
  const db = client.db(dbName);

  cachedDb = db;

  return db;
}

async function GetCurrentDbCollection() {
  const { MONGODB_COLLECTION } = process.env;

  const db = await ConnectToDb();

  if (db === null) {
    return new Error('Database is out of service for now!');
  }

  const collection = db.collection(MONGODB_COLLECTION);

  return collection;
}
