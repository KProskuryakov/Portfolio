import pool from './postgresdb';
import SiteUser from './models/SiteUser';

pool.query("CREATE TABLE IF NOT EXISTS site_users (email varchar(256) PRIMARY KEY, password varchar(80) NOT NULL, display_name varchar(64) UNIQUE NOT NULL);");

export function insertSiteUser(email: string, displayName: string, pass: string, callback: (err: Error, user: SiteUser) => void) {
  pool.query("INSERT INTO site_users (email, password, display_name) VALUES ($1, $2, $3) RETURNING *", [email, pass, displayName], (err: Error, res: any) => {
    if (res) return callback(err, <SiteUser>res.rows[0]);
    return callback(err, null);
  });
}

export function getSiteUserPasswordByEmail(email: string, callback: (err: Error, password: string) => void) {
  pool.query('SELECT * FROM site_users WHERE email = $1', [email], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0].password);
    return callback(err, null);
  });
}
export function getSiteUserByEmail(email: string, callback: (err: Error, user: SiteUser) => void) {
  pool.query('SELECT * FROM site_users WHERE email = $1', [email], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}

export function getSiteUserByDisplayName(displayName: string, callback: (err: Error, user: SiteUser) => void) {
  pool.query('SELECT * FROM site_users WHERE display_name = $1', [displayName], (err: Error, res: any) => {
    if (res) return callback(err, res.rows[0]);
    return callback(err, null);
  });
}

export function getAllSiteUsers(callback: (err: Error, allUsers: SiteUser[]) => void) {
  pool.query('SELECT * FROM site_users', (err: Error, res: any) => {
    if (res) return callback(err, res.rows);
    return callback(err, null);
  });
}