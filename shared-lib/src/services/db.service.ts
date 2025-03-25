import * as dotenv from "dotenv";
import mongoose, {
  Document,
  Model,
  Schema,
  FilterQuery,
  UpdateQuery,
} from "mongoose";

dotenv.config();

export interface DbConfig {
  connectionString: string;
  dbName: string;
}

export type DbRepository<T extends Document> = Model<T>;

export class DbService {
  private static instance: DbService;
  private readonly connectionString: string;
  private isConnected: boolean = false;

  private constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  public static async init(user: string, password: string, dbName: string, fullConnectionString: string | null = null): Promise<DbService> {
    if (!DbService.instance) {
        const connectionString = fullConnectionString ?? `mongodb+srv://${user}:${password}@cluster0.nfqmr.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

      if (!connectionString) {
        throw new Error("DB_CONNECTION_STRING must be defined in environment variables or config");
      }

      DbService.instance = new DbService(connectionString);
      await DbService.instance.connect();
    }
    return DbService.instance;
  }

  public static getInstance(): DbService {
    if (!DbService.instance) {
      throw new Error("DbService must be initialized first. Call DbService.init()");
    }
    return DbService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await mongoose.connect(this.connectionString);
      this.isConnected = true;
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Failed to disconnect from MongoDB:", error);
      throw error;
    }
  }

  public createRepository<T extends Document>(modelName: string, schema: Schema): Model<T> {
    return mongoose.model<T>(modelName, schema);
  }
}
