import { UniqData } from "./common";

export interface VacationType extends UniqData {
  isPrimary: boolean;
  isPaid: boolean;
}

export interface VacationRequest extends UniqData {
  Number: string;
  DateStart: string;
  DateEnd: string;
  DaysCount: number;
  VacationType: VacationType;
  Comment: string;
  Status: string;
  Approver: UniqData;
  Organization: UniqData;
  Employee: UniqData;
}

