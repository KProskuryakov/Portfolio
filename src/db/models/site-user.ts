/**
 * The db representation of a user
 *
 * @interface ISiteUser
 *
 * email: varchar(256) PRIMARY KEY
 * display_name: varchar(64) UNIQUE NOT NULL
 * password: varchar(256)
 */
export interface ISiteUser {
  email: string;
  display_name: string;
  password: string;
}

export default ISiteUser;
