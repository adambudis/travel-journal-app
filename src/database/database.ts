import { SQLiteDatabase } from "expo-sqlite";

// Initialize tables here
const initDatabase = async (db: SQLiteDatabase) => {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS trips (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, date DATE, imageUri TEXT);`
  );
};

export default initDatabase;
