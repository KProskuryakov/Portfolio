
/**
 * Represents the little bit of data for each website that gets sent
 * 
 * @export
 * @interface WebData
 * url: text PRIMARY KEY
 * title: text
 * keywords: text
 * description: text
 */
export interface WebData {
  url: string
  title: string
  keywords: string
  description: string
}

export default WebData