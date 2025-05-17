import { callProxy } from "@/lib/callProxy";
import { User } from "@/typings/user";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UseCustomQueryOptions } from "@/typings/react-query.helpers";

interface GetEmployeeListResponse {
  data: User[];
}

export const useGetEmployeeQuery = (options?: UseCustomQueryOptions<GetEmployeeListResponse>): UseQueryResult<GetEmployeeListResponse, Error> => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => callProxy<GetEmployeeListResponse>(`/resources/employeeList`, 'GET'),
    ...options,
  });
};