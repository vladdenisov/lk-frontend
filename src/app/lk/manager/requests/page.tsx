import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { callProxy } from "@/lib/callProxy";
import { convertRequestType, filterRequestsForTabs, getAvailableStatuses } from "@/lib/requests";
import { getStatusColor, statusesRu } from "@/lib/status";
import { EmployeeRequest } from "@/typings/manager";
import dayjs from "dayjs";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";

const getLink = (type: string, guid: string, status: string) => {
  if (type === "VacationRequest") {
    if (status === "draft") {
      return `/lk/requests/leave/edit?id=${guid}`;
    } else {
      return `/lk/requests/leave/view?id=${guid}`;
    }
  }

  return "";
};

export default async function ManagerRequestsPage() {
  const response = await callProxy<{ data: { vacations: EmployeeRequest[] } }>(
    "/manager/getEmployeeDocs",
    "GET"
  );

  const requestsByStatus = filterRequestsForTabs<EmployeeRequest>(
    response.data.vacations
  );
  const availableStatuses = getAvailableStatuses<EmployeeRequest>(
    response.data.vacations
  );

  console.log(response);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Заявки сотрудников</h1>
          <p className="text-muted-foreground">
            Список заявок, созданных сотрудниками
          </p>
        </div>
      </div>
      <Tabs defaultValue={availableStatuses[0]}>
        <TabsList>
          {availableStatuses.map((status) => (
            <TabsTrigger key={status} value={status}>
              {statusesRu[status]}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="rounded-md border">
          {availableStatuses.map((status) => (
            <TabsContent key={status} value={status}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер</TableHead>
                    <TableHead>Тип заявки</TableHead>
                    <TableHead>Сотрудник</TableHead>
                    <TableHead>Комментарий</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestsByStatus[status].map((item) => (
                    <TableRow key={item.GUID}>
                      <TableCell>{item.Number}</TableCell>
                      <TableCell>{convertRequestType(item.Type)}</TableCell>
                      <TableCell>{item.Employee.name}</TableCell>
                      <TableCell>{item.Comment}</TableCell>
                      <TableCell> <Badge className={getStatusColor(item.Status)}>
                          {statusesRu[item.Status]}
                        </Badge></TableCell>
                      <TableCell>
                        {dayjs(item.CreatedAt).format("DD.MM.YYYY")}
                      </TableCell>
                      <TableCell>
                        <Link href={getLink(item.Type, item.GUID, item.Status)}>
                          <Button variant="outline">
                            <Eye />
                            <span>Просмотреть</span>
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
