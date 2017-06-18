/**
 * Represents a daily lasergame level in the database
 * 
 * @export
 * @interface LasergameDailyLevel
 * daily_date: Date PRIMARY KEY
 * seed: bigint NOT NULL
 * level_data: jsonb
 * times_beaten: integer
 */
export interface LasergameDailyLevel {
  daily_date: string
  seed: number
  level_data: any
  times_beaten: number
}

export default LasergameDailyLevel