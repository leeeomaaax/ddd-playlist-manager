import { MongoClient, Db, Collection } from 'mongodb';
// import { TimeoutUtils } from '../../utils/TimeoutUtils';
// import { Logger } from '../../core/Logger';

// const log = new Logger('infraDatabaseIndex');

const tenSeconds = 10000;

export type Model = Collection;

/**
 * Create database connection
 * @singleton
 */
export class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {
    console.log('Instantiating database');
  }

  static getDatabase(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  private setCient(uri: string): void {
    this.client = new MongoClient(uri, {});
  }

  async connect(uri: string): Promise<void> {
    //We need to reset the client in every connection to avoid mongo errors, we
    //should not call connect multiple times in the same client
    this.setCient(uri);
    try {
      if (!this.client) throw new Error('Database client not created');
      console.log('Trying to connect to database...');
      await this.client.connect();
      this.db = this.client.db();
      // this.db.on('close', () => console.log('Database connection closed'));
      // this.db.on('reconnect', () => console.log('Database reconnected'));
      console.log('Connected to database');
    } catch (e) {
      console.log(`Could not connect do database, retrying in 10s: ${e}`);
      // await TimeoutUtils.sleep(tenSeconds);
      return this.connect(uri);
    }
  }

  async close(): Promise<void> {
    if (this.client) await this.client.close();
  }

  model(name: string): Model {
    if (!this.db) throw new Error();
    return this.db.collection(name);
  }

  get mongoClient(): MongoClient | null {
    return this.client;
  }
}
