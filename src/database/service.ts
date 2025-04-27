// src/services/tripService.ts
import { SQLiteDatabase } from "expo-sqlite";
import { Trip, Destination } from "../types/types";

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
