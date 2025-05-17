import { Button } from "@/components/ui/button";
import Link from "next/link";
import { callProxy } from "@/lib/callProxy";
import { VacationRequest } from "@/typings/vacation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink } from "lucide-react";
import { getStatusColor, statusesRu } from "@/lib/status";
import { filterRequestsForTabs, getAvailableStatuses } from "@/lib/requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getLink = (request: VacationRequest) => {
  switch (request.Status) {
    case 'draft':
      return `/lk/requests/leave/edit?id=${request.GUID}`;
    case 'reviewing':
      return `/lk/requests/leave/view?id=${request.GUID}`;
    case 'approved':
      return `/lk/requests/leave/view?id=${request.GUID}`;
    case 'rejected':
      return `/lk/requests/leave/edit?id=${request.GUID}`;
    case 'revoked':
      return `/lk/requests/leave/edit?id=${request.GUID}`;
    case 'uploaded':
      return `/lk/requests/leave/view?id=${request.GUID}`;
  }
  return '/lk/requests/leave/view?id=' + request.GUID;
}


export default async function RequestsPage() {
  const response = await callProxy<{data: VacationRequest[]}>('/leave/get?isManager=false', 'GET');
  const requests = response.data;

  const requestsByStatus = filterRequestsForTabs<VacationRequest>(requests);
  const availableStatuses = getAvailableStatuses<VacationRequest>(requests);


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Заявки на отпуск</h1>
          <p className="text-muted-foreground">Просмотр и управление заявками на отпуск</p>
        </div>
        <Link href="/lk/requests/leave/edit">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Создать заявку
          </Button>
        </Link>
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
                  <TableHead>Сотрудник</TableHead>
                  <TableHead>Тип отпуска</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestsByStatus[status].map((request) => (
                  <TableRow key={request.GUID}>
                    <TableCell className="font-medium">{request.Number}</TableCell>
                    <TableCell>{request.Employee.name}</TableCell>
                    <TableCell>{request.VacationType.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.Status)}>
                        {statusesRu[request.Status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={getLink(request)}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Просмотр
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