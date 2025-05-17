import { UniqData, ApplicationStatus } from "./common";

export interface EmployeeRequest extends UniqData {
  Number: string;
  Comment: string;
  Status: ApplicationStatus;
  Approver: UniqData;
  Organization: UniqData;
  Employee: UniqData;
  Type: string;
  Creator: UniqData;
  CreatedAt: string;
}