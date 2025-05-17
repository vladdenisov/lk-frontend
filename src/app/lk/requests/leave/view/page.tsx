
import { getVacationRequestQueryOptions } from "@/queries/requests/getVacationRequests.query";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { LeaveRequestComponent } from "./component";

export default async function LeaveRequestPage({searchParams}: {searchParams: Promise<{id: string}>}) {
  const id = (await searchParams).id;
  const queryClient = new QueryClient();
  queryClient.prefetchQuery(getVacationRequestQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LeaveRequestComponent id={id} />
    </HydrationBoundary>
  )
}
