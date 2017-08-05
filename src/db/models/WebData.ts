
/**
 * Represents the little bit of data for each website that gets sent
 *
 * @export
 * @interface WebData
 * url: text PRIMARY KEY
 * title: text
 * keywords: text
 * description: text
 * upload: timestamptz DEFAULT current_timestamp
 */
export interface IWebData {
  url: string;
  title: string;
  keywords: string;
  description: string;
  upload: string;
}

export default IWebData;
