import { callProxy } from "@/lib/callProxy";
import { VacationRequest } from "@/typings/vacation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MessageSquare, User, Building2, CheckCircle2 } from "lucide-react";
import { PrintButton } from "@/components/print/print-button";
export default async function LeaveRequestPage({ params }: { params: { id: string } }) {
  const request = (await callProxy<{data: VacationRequest}>(`/leave/getById?GUID=${params.id}`, 'GET')).data;

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/lk/requests">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Заявка на отпуск</h1>
        </div>
        <Badge className={getStatusColor(request.Status)}>{request.Status}</Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="mt-6">
            <CardTitle>Информация об отпуске</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Период</p>
                    <p className="font-medium">
                      {format(new Date(request.DateStart), 'dd.MM.yyyy')} - {format(new Date(request.DateEnd), 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Количество дней</p>
                    <p className="font-medium">{request.DaysCount} дней</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Комментарий</p>
                    <p className="font-medium">{request.Comment || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Сотрудник</p>
                    <p className="font-medium">{request.Employee.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Организация</p>
                    <p className="font-medium">{request.Organization.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Согласующий</p>
                    <p className="font-medium">{request.Approver.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <PrintButton id={request.GUID} type="leave" />
      </div>
    </div>
  );
}
