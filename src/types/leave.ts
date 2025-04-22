export interface LeaveType {
  name: string;
  GUID: string;
  isPrimary: boolean;
  isPaid: boolean;
}

export interface VacationDaysResponse {
  Days: number;
  RemainingInfo: string;
  Remaining: number;
  WorkPeriodStart: string;
  WorkPeriodEnd: string;
}

export interface VacationDaysRequest {
  DateStart: string;
  DateEnd: string;
  VacationType: string;
} 