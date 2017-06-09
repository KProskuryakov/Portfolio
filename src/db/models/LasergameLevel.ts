/**
 * Represents a LasergameLevel in the database
 * 
 * @interface LasergameLevel
 * id: SERIAL PRIMARY KEY
 * name: varchar(64)
 * level_data: jsonb
 * upload_timestamp: timestamp with timezone?
 * times_beaten: integer?
 * user_display_name: varchar(64) fkey to site_users.display_name
 */
export interface LasergameLevel {
  id: number,
  name: string,
  level_data: any,
  upload_timestamp: string,
  times_beaten: number,
  user_display_name: string
}

export default LasergameLevel;