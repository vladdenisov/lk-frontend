'use client';
import { UniqData } from "@/typings/common";
import { User } from "@/typings/user";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";

const columns: GridColDef<User>[] = [
  { field: 'name', headerName: 'name', flex: 1 },
  { field: 'Position', headerName: 'Position', type: 'number', flex: 1, valueGetter: (value: UniqData) => value?.name },
  { field: 'Department.name', headerName: 'Department', flex: 1, valueGetter: (value: UniqData) => value?.name },
  { field: 'DayIn', headerName: 'Day In', type: 'number', flex: 1 },
  { field: 'DayOut', headerName: 'Day Out', type: 'number',flex: 1 },
  { field: 'Organization.name', headerName: 'Organization', flex: 1, valueGetter: (value: UniqData) => value?.name },
  { field: 'Number', headerName: 'Number', type: 'number', flex: 1 },
];

export const UsersTable: FC<{data: User[]}> = ({data}) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row => row.GUID)}
        sx={{
          width: '100%',
        }}
      />
    </div>
  );
}
