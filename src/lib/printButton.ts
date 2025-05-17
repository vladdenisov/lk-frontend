import { CurrentUser } from "@/types/user";
import { ApplicationStatus } from "@/typings/common";
import { CurrentProxyUser, User } from "@/typings/user";

export const isPrintAvailable = (type: string, status: ApplicationStatus, user: CurrentUser | null, request?: any) => {
  if (type === 'leave') {
    if (status === 'draft' || status === 'rejected' || status === 'revoked') {
      return true;
    }
  }
  return false;
}
