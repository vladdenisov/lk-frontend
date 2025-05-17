import { callProxy } from "@/lib/callProxy";
import { VacationRequest } from "@/typings/vacation";
import { useQuery } from "@tanstack/react-query";

interface VacationRequestQueryResponse {
  data: VacationRequest;
}

export const getVacationRequestQueryOptions = (id: string) => {
  return {
    queryKey: ["vacationRequests", id],
    queryFn: () => callProxy<VacationRequestQueryResponse>(`/leave/getById?GUID=${id}`, "GET"),
  }
}

export const useGetVacationRequestQuery = (id: string) => {
  return useQuery<VacationRequestQueryResponse>(getVacationRequestQueryOptions(id));
};