import { UniqData } from "./common";

export interface CurrentProxyUser {
  id: number;
  name: string;
  email: string;
  GUID: string;
  roles: string[];
}

export interface User {
  "GUID": string;
  "name": string;
  "Number": string;
  "Position": UniqData;
  "Department": UniqData;
  "DayIn": string;
  "DayOut": string;
  "Organization": UniqData;
}