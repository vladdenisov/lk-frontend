import { callProxy } from "@/lib/callProxy";
import { User } from "@/typings/user";
import { Box, Table } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { HydrationBoundary } from "@tanstack/react-query";
import { UsersTable } from "./content";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const fetchData = async () => {
  const data = await callProxy<{
    employees: User[];
  }>('/resources/employees', 'GET');
  return data.employees;
};


export default async function Page() {
  const data = await fetchData();

  return (
    <div>
      <h1>Users</h1>
      <Suspense fallback={<Box color={'black'}>Loading...</Box>}>
        <UsersTable data={data} />
      </Suspense>
    </div>
  );
}
