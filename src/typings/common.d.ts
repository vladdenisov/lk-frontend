export interface UniqData {
  GUID: string;
  name?: string;
}

export interface Attachment extends UniqData {
  FileName: string;
  FileData: string;
  Signed?: boolean;
}

export interface Application extends UniqData {
  Number: string;
  Attachments?: Attachment[];
  Status: ApplicationStatus;
  Comment: string;
  Approver: UniqData;
  Organization: UniqData;
  Employee: UniqData;
}

export type ApplicationStatus = 'draft' | 'reviewing' | 'approved' | 'rejected' | 'revoked' | 'uploaded';