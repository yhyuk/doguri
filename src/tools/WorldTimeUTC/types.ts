export interface TimezoneOffset {
  name: string;
  offset: string;
  description: string;
}

export interface UnixTimestampResult {
  timestamp: number;
  dateTime: string;
  iso8601: string;
}

export interface LocalToUTCResult {
  localTime: string;
  utcTime: string;
  iso8601: string;
}
