// src/services/tripService.ts
import { SQLiteDatabase } from "expo-sqlite";
import { Trip, Destination, NewTrip, NewDestination } from "../types/types";

/**
 * Create a new trip
 */
export async function createTrip(
  db: SQLiteDatabase,
  trip: NewTrip
): Promise<number> {
  const { name, description, date, imageUri } = trip;
  const result = await db.runAsync(
    `INSERT INTO trips (name, description, date, imageUri) VALUES (?, ?, ?, ?);`,
    [name, description, date.toISOString(), imageUri]
  );
  return result.lastID as number;
}

/**
 * Fethc all trips
 */
export async function getAllTrips(db: SQLiteDatabase): Promise<Trip[]> {
  const rows = await db.getAllAsync("SELECT * FROM trips;");
  return rows as Trip[];
}

/**
 * Fetch a single trip by ID
 */
export async function getTripById(
  db: SQLiteDatabase,
  tripId: number
): Promise<Trip | null> {
  const rows = await db.getAllAsync("SELECT * FROM trips WHERE id = ?;", [
    tripId,
  ]);
  return rows.length ? (rows[0] as Trip) : null;
}

/**
 * Delete a trip by ID
 */
export async function deleteTripById(
  db: SQLiteDatabase,
  tripId: number
): Promise<void> {
  await db.runAsync("DELETE FROM trips WHERE id = ?;", [tripId]);
}

/**
 * Create a new destination
 */
export async function createDestination(
  db: SQLiteDatabase,
  tripId: number,
  destination: NewDestination
): Promise<number> {
  const { name, description, date, latitude, longitude, imageUri } =
    destination;
  const result = await db.runAsync(
    `INSERT INTO destinations (trip_id, name, description, date, latitude, longitude, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      tripId,
      name,
      description,
      date.toISOString(),
      latitude,
      longitude,
      imageUri,
    ]
  );
  return result.lastID as number;
}

/**
 * Fetch a single destination
 */
export async function getDestinationById(
  db: SQLiteDatabase,
  destinationId: number
): Promise<Destination | null> {
  const rows = await db.getAllAsync(
    "SELECT * FROM destinations WHERE id = ?;",
    [destinationId]
  );
  return rows.length ? (rows[0] as Destination) : null;
}

/**
 * Update a destination
 */
export async function updateDestination(
  db: SQLiteDatabase,
  destination: Destination
): Promise<void> {
  const { id, name, description, date, latitude, longitude, imageUri } =
    destination;
  await db.runAsync(
    `UPDATE destinations SET name = ?, description = ?, date = ?, latitude = ?, longitude = ?, imageUri = ? WHERE id = ?;`,
    [name, description, date.toISOString(), latitude, longitude, imageUri, id]
  );
}

/**
 * Fetch all destinations for a given trip
 */
export async function getDestinationsByTripId(
  db: SQLiteDatabase,
  tripId: number
): Promise<Destination[]> {
  const rows = await db.getAllAsync(
    "SELECT * FROM destinations WHERE trip_id = ? ORDER BY date;",
    [tripId]
  );
  return rows as Destination[];
}

/**
 * Delete a destination by ID
 */
export async function deleteDestinationById(
  db: SQLiteDatabase,
  destinationId: number
): Promise<void> {
  await db.runAsync("DELETE FROM destinations WHERE id = ?;", [destinationId]);
}
