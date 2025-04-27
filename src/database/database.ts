import { SQLiteDatabase } from "expo-sqlite";

// Initialize tables here
const initDatabase = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS trips (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          date DATE,
          imageUri TEXT
        );
      
        CREATE TABLE IF NOT EXISTS destinations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trip_id INTEGER,
          name TEXT,
          description TEXT,
          date DATE,
          latitude REAL,
          longitude REAL,
          imageUri TEXT,
          FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
        );
      `);
};

export default initDatabase;
