import pool from "./Postgres";

/**
 * The db representation of a user
 *
 * @interface SiteUser
 *
 * email: varchar(256) PRIMARY KEY
 * display_name: varchar(64) UNIQUE NOT NULL
 * password: varchar(256)
 */
export default interface SiteUser {
  email: string;
  display_name: string;
  password: string;
}

export async function insertSiteUser(email: string, displayName: string, pass: string): Promise<SiteUser> {
  const res = await pool.query(
    `INSERT INTO site_users (email, password, display_name)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [email, pass, displayName]);
  return res.rows[0];
}

export async function getSiteUserPasswordByEmail(email: string): Promise<string> {
  const res = await pool.query("SELECT * FROM site_users WHERE email = $1;", [email]);
  return res.rows[0].password;
}

export async function getSiteUserByEmail(email: string): Promise<SiteUser> {
  const res = await pool.query("SELECT * FROM site_users WHERE email = $1;", [email]);
  return res.rows[0];
}

export async function getSiteUserByDisplayName(displayName: string): Promise<SiteUser> {
  const res = await pool.query("SELECT * FROM site_users WHERE display_name = $1;", [displayName]);
  return res.rows[0];
}

export async function getAllSiteUsers(): Promise<SiteUser[]> {
  const res = await pool.query("SELECT * FROM site_users;");
  return res.rows;
}
