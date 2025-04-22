'use client'
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useLeaveRequest } from "@/hooks/useLeaveRequest";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { callProxy } from "@/lib/callProxy";
import { useRouter } from "next/navigation";
export default function CreateLeaveRequest() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [comment, setComment] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const router = useRouter();
  const {
    leaveTypes,
    selectedLeaveType,
    setSelectedLeaveType,
    vacationDaysInfo,
    calculateVacationDays,
    isLoading,
    error
  } = useLeaveRequest();

  useEffect(() => {
    console.log(startDate, endDate, selectedLeaveType);
    if (startDate && endDate && selectedLeaveType) {
      calculateVacationDays(startDate, endDate);
    }
  }, [startDate, endDate, selectedLeaveType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(startDate, endDate, selectedLeaveType, comment);
    const response = await callProxy<any>('/leave/create', 'POST', {
      DateStart: format(startDate, 'yyyy-MM-dd'),
      DateEnd: format(endDate, 'yyyy-MM-dd'),
      DaysCount: vacationDaysInfo?.Days,
      VacationType: selectedLeaveType,
      Comment: comment,
    });
    if (response.success) {
      router.replace(`/lk/requests/leave/create/${response.id}`);
    } else {
      setErrorMessage(response.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Создание заявки на отпуск</h1>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="leaveType" className="block mb-2 font-medium">
              Тип отпуска:
            </label>
            <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
              <SelectTrigger id="leaveType" className="w-full">
                <SelectValue placeholder="Выберите тип отпуска" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.GUID} value={type.GUID}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="startDate" className="block mb-2 font-medium">
              Дата начала отпуска:
            </label>
            <DatePicker
              id="startDate"
              date={startDate ?? new Date()}
              setDate={setStartDate}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block mb-2 font-medium">
              Дата окончания отпуска:
            </label>
            <DatePicker
              id="endDate"
              date={endDate ?? new Date()}
              setDate={setEndDate}
            />
          </div>

          {vacationDaysInfo && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Количество дней:</p>
                    <p className="font-medium">{vacationDaysInfo.Days}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Остаток:</p>
                    <p className="font-medium">{vacationDaysInfo.RemainingInfo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Период работы:</p>
                    <p className="font-medium">
                      {format(new Date(vacationDaysInfo.WorkPeriodStart), 'dd.MM.yyyy')} - {format(new Date(vacationDaysInfo.WorkPeriodEnd), 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <label htmlFor="comment" className="block mb-2 font-medium">
              Комментарий:
            </label>
            <Textarea id="comment" value={comment} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : 'Создать заявку'}
          </Button>
        </div>
      </form>
    </div>
  );
}

