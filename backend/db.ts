import { MongoClient, Db, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Missing MONGO_URI in .env");

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db: Db | null = null;

export async function connectDB(): Promise<Db> {
    if (db) return db;

    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const dbName = process.env.DB_NAME ?? "Assignment2";
    db = client.db(dbName);

    return db;
}