"use client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  User,
  Building2,
  CheckCircle2,
  File,
} from "lucide-react";
import { PrintButton } from "@/components/print/print-button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PDFDialog } from "@/components/print/pdf-dialog";
import { useGetVacationRequestQuery } from "@/queries/requests/getVacationRequests.query";
import { Preloader } from "@/components/ui/preloader";
import { getStatusColor, statusesRu } from "@/lib/status";
import { useAuth } from "@/context/auth-context";
import { isPrintAvailable } from "@/lib/printButton";
import { VacationRequestCreate } from "@/typings/vacation";
import { callProxy } from "@/lib/callProxy";
import { useRouter } from "next/navigation";
import { ApplicationStatus } from "@/typings/common";
import { isButtonAvailable, isSignAvailable } from "@/lib/requests";
export const LeaveRequestComponent = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetVacationRequestQuery(id);

  const { user } = useAuth();
  const router = useRouter();
  const request = data?.data;

  if (isLoading || !request) {
    return <Preloader />;
  }

  const updateStatus = async (status: ApplicationStatus) => {
    const data: VacationRequestCreate = {
      VacationType: request.VacationType.GUID,
      Employee: request.Employee.GUID,
      Status: status,
      DateStart: request.DateStart,
      DateEnd: request.DateEnd,
      DaysCount: request.DaysCount,
      Comment: request.Comment,
    }
    const response = await callProxy<any>(`/leave/update?GUID=${id}`, 'PUT', data);
    if (response.GUID) {
      router.replace(`/lk/requests/leave?id=${response.GUID}`);
    }
  };

  const handleApprove = async () => {
    await updateStatus("approved");
  };

  const handleReject = async () => {
    await updateStatus("rejected");
  };

  const handleRevoke = async () => {
    await updateStatus("revoked");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/lk/requests/leave">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Заявка на отпуск</h1>
        </div>
        <Badge className={getStatusColor(request?.Status ?? "")}>
          {statusesRu[request?.Status ?? ""]}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="mt-6">
            <CardTitle>Информация об отпуске</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Период</p>
                    <p className="font-medium">
                      {format(new Date(request.DateStart), "dd.MM.yyyy")} -{" "}
                      {format(new Date(request.DateEnd), "dd.MM.yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Количество дней
                    </p>
                    <p className="font-medium">{request.DaysCount} дней</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Комментарий</p>
                    <p className="font-medium">{request.Comment || "—"}</p>
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

        <Card>
          <CardHeader className="mt-6">
            <CardTitle>Прикрепленные файлы</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 mt-6">
            {request.Attachments?.map((attachment) => (
              <Dialog key={attachment.GUID}>
                <DialogTrigger asChild>
                  <div
                    key={attachment.GUID}
                    className="flex py-3 px-4 rounded-md border border-border hover:bg-accent transition-all duration-200 cursor-pointer"
                  >
                    <File className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="ml-2 text-muted-foreground">
                      {attachment.FileName}
                    </p>
                    {attachment.Signed && (
                      <CheckCircle2 className="ml-2 h-5 w-5 text-muted-foreground mt-0.5" />
                    )}
                  </div>
                </DialogTrigger>
                <PDFDialog fileData={attachment.FileData} isLoading={false} />
              </Dialog>
            ))}
          </CardContent>
        </Card>
        {isPrintAvailable("leave", request.Status, user, request) && user && (
          <PrintButton id={request.GUID} type="leave" isSignAvailable={isSignAvailable(user, request)} />
        )}

        {user && isButtonAvailable("approve", request.Status, user, request) && (
          <div className="flex justify-end flex-row gap-2">
            <Button variant="default" onClick={handleApprove}>
              Согласовать
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Отклонить
            </Button>
          </div>
        )}

        {user && isButtonAvailable("revoke", request.Status, user, request) && (
          <div className="flex justify-end flex-row gap-2">
            <Button variant="destructive" onClick={handleRevoke}>
              Отозвать
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
