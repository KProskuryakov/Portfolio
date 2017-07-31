import LasergameLevel from "db/models/lasergame-level";
import pool from "db/postgresdb";

pool.query(`
CREATE TABLE IF NOT EXISTS lasergame_levels
(
  id serial PRIMARY KEY,
  name varchar(64) NOT NULL,
  level_data jsonb NOT NULL,
  upload_timestamp timestamptz DEFAULT current_timestamp,
  times_beaten int DEFAULT 0,
  user_display_name varchar(64) references site_users (display_name)
);`);

export async function getAllLasergameLevelsOfSiteUser(playerName: string): Promise<LasergameLevel[]> {
  const res = await pool.query("SELECT * FROM lasergame_levels WHERE user_display_name = $1 ORDER BY id ASC;",
    [playerName]);
  return res.rows;
}

export async function getLasergameLevelByID(id: number): Promise<LasergameLevel> {
  const res = await pool.query("SELECT * FROM lasergame_levels WHERE id = $1;", [id]);
  return res.rows[0];
}

export async function insertLasergameLevel(levelData: any,
                                           name: string,
                                           userDisplayName: string,
                                          ): Promise<LasergameLevel> {
  const res = await pool.query(`INSERT INTO lasergame_levels (level_data, name, user_display_name)
                                VALUES ($1, $2, $3)
                                RETURNING *;`,
                                [JSON.stringify(levelData), name, userDisplayName]);
  return res.rows[0];
}
