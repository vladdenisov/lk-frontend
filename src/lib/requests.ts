import { Application, ApplicationStatus } from "@/typings/common";
import { statusesRu } from "./status";
import { CurrentUser } from "@/types/user";

type RequestsByStatus<T> = {
  [key in ApplicationStatus]: T[];
}

export const filterRequestsForTabs = <T extends { Status: string }>(requests: T[]): RequestsByStatus<T> => {
  return requests.reduce((acc, request) => {
    acc[request.Status as ApplicationStatus] = [...(acc[request.Status as ApplicationStatus] || []), request];
    return acc;
  }, {} as RequestsByStatus<T>);
}

export const getAvailableStatuses = <T extends { Status: string }>(request: T[]): ApplicationStatus[] => {
  const statuses = request.reduce((acc, request) => {
    if (!acc.includes(request.Status as ApplicationStatus) && request.Status) {
      acc.push(request.Status as ApplicationStatus);
    }
    return acc;
  }, [] as ApplicationStatus[]);
  return statuses.sort((a, b) => statusesRu[a].localeCompare(statusesRu[b]));
}

export const convertRequestType = (type: string) => {
  switch (type) {
    case "VacationRequest":
      return "Заявка на отпуск";
  }
  return 'Заявка'
}

export const isButtonAvailable = <T extends { Status: string, Employee: { GUID: string }, Approver: { GUID: string } }>(button: 'approve' | 'reject' | 'revoke', status: ApplicationStatus, user: CurrentUser, request: T) => {
  if (button === 'approve') {
    return user?.roles.includes("manager") && request.Status === "reviewing" && request.Approver?.GUID === user?.GUID
  }
  if (button === 'reject') {
    return user?.roles.includes("manager") && request.Status === "reviewing" && request.Approver?.GUID === user?.GUID
  }
  if (button === 'revoke') {
    return user?.GUID === request.Employee?.GUID && status === 'reviewing' && request.Approver?.GUID !== user?.GUID
  }
}

export const isSignAvailable = <T extends { Status: string, Employee: { GUID: string }, Approver: { GUID: string } }>(user: CurrentUser, request: T) => {
  return user?.GUID === request.Employee?.GUID
}
