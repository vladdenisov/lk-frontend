import { Application, UniqData, Attachment, ApplicationStatus } from "./common";

export interface VacationType extends UniqData {
  isPrimary: boolean;
  isPaid: boolean;
}


export interface VacationRequest extends Application {
  DateStart: string;
  DateEnd: string;
  DaysCount: number;
  VacationType: VacationType;
}

export interface VacationRequestCreate extends Omit<VacationRequest, 'GUID' | 'Number' | 'Status' | 'Approver' | 'Organization' | 'name'> {
  VacationType: string;
  Employee: string;
  Attachments?: Attachment[];
  Status: ApplicationStatus;
}
