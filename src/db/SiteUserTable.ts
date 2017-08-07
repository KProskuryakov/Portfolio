import SiteUser from "./models/SiteUser";
import pool from "./Postgres";

export async function insertSiteUser(email: string, displayName: string, pass: string): Promise<SiteUser> {
  const res = await pool.query(`INSERT INTO site_users (email, password, display_name)
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
