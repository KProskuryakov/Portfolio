/**
 * The db representation of a user
 *
 * @interface SiteUser
 *
 * email: varchar(256) PRIMARY KEY
 * display_name: varchar(64) UNIQUE NOT NULL
 * password: varchar(256)
 */
export interface SiteUser {
  email: string;
  display_name: string;
  password: string;
}

export default SiteUser;
