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

export default async function RequestsPage() {
  const response = await callProxy<{data: VacationRequest[]}>('/leave/get?employee_id=66b457c9-7c02-11e2-9362-001b11b25590', 'GET');
  const requests = response.data;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Заявки на отпуск</h1>
          <p className="text-muted-foreground">Просмотр и управление заявками на отпуск</p>
        </div>
        <Link href="/lk/requests/leave/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать заявку
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
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
            {requests.map((request) => (
              <TableRow key={request.GUID}>
                <TableCell className="font-medium">{request.Number}</TableCell>
                <TableCell>{request.Employee.name}</TableCell>
                <TableCell>{request.VacationType.name}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.Status)}>
                    {request.Status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/lk/requests/leave/${request.GUID}`}>
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
      </div>
    </div>
  );
} 