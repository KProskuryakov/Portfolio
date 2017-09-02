import pool from "../../db/Postgres";

import * as laserGrid from "../LaserGrid";
import Path from "../Path";

/**
 * Represents a daily lasergame level in the database
 *
 * @interface LasergameDailyLevel
 *
 * daily_date: Date PRIMARY KEY
 * seed: bigint NOT NULL
 * level_data: jsonb
 * times_beaten: integer
 */
export default interface LasergameDailyLevel {
  daily_date: string;
  seed: number;
  level_data: any;
  times_beaten: number;
}

export async function getDailyLevel(date: string): Promise<LasergameDailyLevel> {
  const res = await pool.query("SELECT * FROM lasergame_daily_levels WHERE daily_date = $1", [date]);
  return res.rows[0];
}

export async function getAllDailyLevels(): Promise<LasergameDailyLevel[]> {
  const res = await pool.query("SELECT * FROM lasergame_daily_levels");
  return res.rows;
}

export async function insertDailyLevel(
  levelData: {
    paths: Path[],
    availablePieces: laserGrid.GridPiece[],
  },
  seed: number): Promise<LasergameDailyLevel> {
  const res = await pool.query("INSERT INTO lasergame_daily_levels (level_data, seed) VALUES ($1, $2) RETURNING *",
    [JSON.stringify(levelData), seed]);
  return res.rows[0];
}
