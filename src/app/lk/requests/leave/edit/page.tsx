'use client'
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaveRequest } from "@/hooks/useLeaveRequest";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { callProxy } from "@/lib/callProxy";
import { useRouter, useSearchParams } from "next/navigation";
import { VacationRequest, VacationRequestCreate } from "@/typings/vacation";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { leaveRequestSchema } from "./schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, FileTextIcon, File, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useGetEmployeeQuery } from "@/queries/employees/getEmployeeList.query";
import { useAuth } from "@/context/auth-context";
import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { PDFDialog } from "@/components/print/pdf-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isPrintAvailable } from "@/lib/printButton";
import { PrintButton } from "@/components/print/print-button";
import { isSignAvailable } from "@/lib/requests";

export default function LeaveRequestPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id') as string;
  const [request, setRequest] = useState<VacationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const isEditMode = Boolean(id);

  const { user } = useAuth();

  const { data: employees, isLoading: isEmployeesLoading } = useGetEmployeeQuery();

  console.log(employees);

  // Initialize form with schema validation
  const form = useForm<VacationRequestCreate>({
    resolver: yupResolver(leaveRequestSchema),
    defaultValues: {
      DateStart: format(new Date(), 'yyyy-MM-dd'),
      DateEnd: format(new Date(), 'yyyy-MM-dd'),
      Comment: '',
      VacationType: '',
      DaysCount: 0,
      Employee: user?.GUID,
      Status: 'draft'
    }
  });

  const attachments = useWatch({control: form.control, name: 'Attachments'})

  const {
    leaveTypes,
    selectedLeaveType,
    setSelectedLeaveType,
    vacationDaysInfo,
    calculateVacationDays
  } = useLeaveRequest({
    selectedLeaveType: form.watch('VacationType')
  });

  // Fetch request data if in edit mode
  useEffect(() => {
    const fetchRequestData = async () => {
      if (isEditMode) {
        try {
          setIsLoading(true);
          const response = await callProxy<{data: VacationRequest}>(`/leave/getById?GUID=${id}`, 'GET');
          setRequest(response.data);
          
          // Set form values from the fetched request
          form.setValue('DateStart', response.data.DateStart);
          form.setValue('DateEnd', response.data.DateEnd);
          form.setValue('Comment', response.data.Comment || '');
          form.setValue('VacationType', response.data.VacationType.GUID);
          form.setValue('DaysCount', response.data.DaysCount);
          form.setValue('Employee', response.data.Employee.GUID);
          form.setValue('Status', response.data.Status);

          setSelectedLeaveType(response.data.VacationType.GUID);
        } catch (error: any) {
          console.error('Error fetching request:', error);
          setErrorMessage(error.message || 'Не удалось загрузить данные заявки. Пожалуйста, попробуйте снова.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchRequestData();
  }, [id, isEditMode, form]);

  // Calculate vacation days when dates or leave type changes
  useEffect(() => {
    const startDate = form.watch('DateStart');
    const endDate = form.watch('DateEnd');
    const leaveType = form.watch('VacationType');
    
    if (startDate && endDate && leaveType) {
      calculateVacationDays(new Date(startDate), new Date(endDate));
    }
  }, [form.watch('DateStart'), form.watch('DateEnd'), form.watch('VacationType')]);

  // Update days count in form when calculation is completed
  useEffect(() => {
    if (vacationDaysInfo) {
      form.setValue('DaysCount', vacationDaysInfo.Days);
    }
  }, [vacationDaysInfo, form]);

  useEffect(() => {
    if (employees?.data.length === 1) {
      form.setValue('Employee', employees.data[0].GUID);
    } else {
      form.setValue('Employee', user?.GUID || '');
    }
  }, [employees, form, user]);

  // Handle form submission
  const onSubmit = async (data: VacationRequestCreate) => {
    try {
      setIsLoading(true);
      setErrorMessage(undefined); // Clear previous errors
      let response: any;
      if (id) {
        response = await callProxy<any>(`/leave/update?GUID=${id}`, 'PUT', data);
      } else {
        response = await callProxy<any>('/leave/create', 'POST', data);
      }
      
      if (response.GUID) {
        if (data?.Status === "reviewing" || data?.Status === "approved") {
          router.replace(`/lk/requests/leave/view?id=${response.GUID}`);
        } else {
          router.replace(`/lk/requests/leave/edit?id=${response.GUID}`);
        }
      } else {
        setErrorMessage(response.message || 'Произошла ошибка при отправке заявки.');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.message || 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto min-w-xl">
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-blue-600 text-white py-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            {isEditMode ? 'Редактирование заявки на отпуск' : 'Создание заявки на отпуск'}
          </CardTitle>
        </CardHeader>
          
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center h-[200px]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-sm text-gray-600">Загрузка...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-w-xl">
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-blue-600 text-white py-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            {isEditMode ? 'Редактирование заявки на отпуск' : 'Создание заявки на отпуск'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
              <div className="flex flex-col gap-6 w-full min-w-xl">
                <div>
                  <FormField
                    control={form.control}
                    name="Employee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Сотрудник</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={user?.GUID}
                            disabled={employees?.data.length === 1}
                          >
                            <SelectTrigger id="employee" className="w-full">
                              <SelectValue placeholder="Выберите сотрудника" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees?.data.map((employee) => (
                                <SelectItem key={employee.GUID} value={employee.GUID}>
                                  {employee.name} - {employee.Number}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="VacationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Тип отпуска</FormLabel>
                        <FormControl>
                          <Select 
                            value={field.value} 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedLeaveType(value);
                            }}
                          >
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="DateStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Дата начала отпуска</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <DatePicker
                            id="startDate"
                            date={field.value ? new Date(field.value) : new Date()}
                            setDate={(date) => {
                              if (date) {
                                field.onChange(format(date, 'yyyy-MM-dd'));
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="DateEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Дата окончания отпуска</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <DatePicker
                            id="endDate"
                            date={field.value ? new Date(field.value) : new Date()}
                            setDate={(date) => {
                              if (date) {
                                field.onChange(format(date, 'yyyy-MM-dd'));
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {vacationDaysInfo && (
                <Card className="mt-4 bg-blue-50 border-0">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base font-medium text-blue-800">Информация об отпуске</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-600">Количество дней:</span>
                        <span className="font-medium text-gray-900">{vacationDaysInfo.Days}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-600">Остаток:</span>
                        <span className="font-medium text-gray-900">{vacationDaysInfo.RemainingInfo}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-600">Период работы:</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(vacationDaysInfo.WorkPeriodStart), 'dd.MM.yyyy')} - {format(new Date(vacationDaysInfo.WorkPeriodEnd), 'dd.MM.yyyy')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Separator className="my-6" />

              <FormField
                control={form.control}
                name="Comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Комментарий</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[120px] resize-none" placeholder="Укажите дополнительную информацию" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {attachments?.length && attachments.length > 0 && (
              <Card>
                <CardHeader className="mt-6">
                  <CardTitle>Прикрепленные файлы</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 mt-6">
                  {attachments?.map((attachment) => (
                    <Dialog key={attachment.GUID}>
                      <DialogTrigger asChild>
                        <div key={attachment.GUID} className="flex py-3 px-4 rounded-md border border-border hover:bg-accent transition-all duration-200 cursor-pointer">
                          <File className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <p className="ml-2 text-muted-foreground">{attachment.FileName}</p>
                          {attachment.Signed && <CheckCircle2 className="ml-2 h-5 w-5 text-muted-foreground mt-0.5" />}
                        </div>
                      </DialogTrigger>
                      <PDFDialog fileData={attachment.FileData} isLoading={false}/>
                    </Dialog>
                  ))}
                </CardContent>
              </Card>
              )}

              <div className="flex justify-end pt-2 gap-2">
              {isPrintAvailable("leave", request?.Status ?? "draft", user, request) && user && request && (
                <PrintButton id={request?.GUID} type="leave" isSignAvailable={isSignAvailable(user, request)}/>
              )}

                <Button 
                  type="button" 
                  onClick={() => {
                    form.setValue('Status', 'reviewing');
                    form.handleSubmit(onSubmit)();
                  }}
                  className="px-6 bg-black hover:bg-gray-800 text-white" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Отправка...</span>
                    </div>
                  ) : (
                    <span>Отправить на согласование</span>
                  )}
                </Button>
                <Button 
                  type="submit" 
                  className="px-6 bg-black hover:bg-gray-800 text-white" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Отправка...</span>
                    </div>
                  ) : (
                    <span>{isEditMode ? 'Обновить заявку' : 'Создать заявку'}</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

