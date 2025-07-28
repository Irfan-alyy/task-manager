import { MongoClient, Db } from "mongodb";
const uri=process.env.MONGODB_URI;
const dbName=process.env.MONGODB_DB;

if (!uri) throw new Error("❌ MONGODB_URI is not defined in .env.local");
if (!dbName) throw new Error("❌ MONGODB_DB is missing");


let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}
if(!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().then((client) => {
        console.log("MongoDB connected");
        return client;
    });
}


clientPromise = global._mongoClientPromise;

export async function getDb():Promise<Db>{
    const client = await clientPromise;
    return client.db(dbName);
}

