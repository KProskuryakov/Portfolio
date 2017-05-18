/**
 * The db representation of a user
 * 
 * @interface SiteUser
 * 
 * email: varchar(256)
 * display_name: varchar(64)
 * password: varchar(256)
 */
export interface SiteUser {
    email: string,
    display_name: string,
    password: string
}

/**
 * Represents a LasergameLevel in the database
 * 
 * @interface LasergameLevel
 * id SERIAL
 * name varchar(64)
 * level_data jsonb
 * upload_timestamp timestamp with timezone?
 * times_beaten integer?
 * user_display_name varchar(64) fkey to site_users.display_name
 */
export interface LasergameLevel {
    id: number,
    name: string,
    level_data: any,
    upload_timestamp: string,
    times_beaten: number,
    user_display_name: string
}