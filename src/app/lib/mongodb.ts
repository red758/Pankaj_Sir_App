import { MongoClient, type Db } from "mongodb";

/**
 * Serverless-safe MongoDB connection.
 *
 * Why this file exists: in a serverless environment (Vercel, AWS Lambda, etc.),
 * a naive `new MongoClient(...).connect()` call inside a route handler creates a
 * brand new database connection on every single invocation. Under real traffic,
 * that exhausts MongoDB's connection limit very quickly and takes the database
 * down — not because the code is "wrong" in a normal sense, but because it
 * doesn't account for how serverless functions actually run.
 *
 * The fix: cache the connection on the Node.js global object, so repeated
 * invocations of the same warm function instance reuse the same connection
 * instead of opening a new one. In local development, Next.js hot-reloads
 * modules on every file save, so we cache on `global` there too — otherwise
 * dev mode alone can leak dozens of connections during a single session.
 */

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable."
  );
}
if (!MONGODB_DB_NAME) {
  throw new Error(
    "Missing MONGODB_DB_NAME environment variable."
  );
}

type MongoCache = {
  client: MongoClient | null;
  clientPromise: Promise<MongoClient> | null;
};

// Registering the _mongocache to the global type so TypeScript knows about our cache slot.
declare global {
  var _mongoCache: MongoCache | undefined;
}

const cache: MongoCache = global._mongoCache ?? { client: null, clientPromise: null };

if (process.env.NODE_ENV !== "production") {
  global._mongoCache = cache;
}

function createClient(): Promise<MongoClient> {

  if(!MONGODB_URI){
    throw new Error("DBApi is missinig");
  }

  const client = new MongoClient(MONGODB_URI as string, {
    // Keep a modest, explicit pool size rather than the driver's default.
    // This is a starting point for MVP traffic, not a final tuned value —
    // revisit once real load/connection metrics exist (see TRD Section 5).
    maxPoolSize: 10,
  });
  return client.connect();
}

/**
 * Returns a connected, reused MongoClient. Safe to call from any API route
 * or server component — it will never open more than one connection per
 * warm function instance.
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!cache.clientPromise) {
    cache.clientPromise = createClient();
  }
  cache.client = await cache.clientPromise;
  return cache.client;
}

/*
 * Convenience helper for the common case: getting the app's database handle
 * directly, without every caller needing to know the database name.
 */
export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(MONGODB_DB_NAME);
}