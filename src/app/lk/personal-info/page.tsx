'use server';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, MapPin, Mail, Phone } from "lucide-react";
import { callProxy } from "@/lib/callProxy";

interface ContactsType {
  email: string | null;
  emailFormatted: string | null;
  mobilePhone: string | null;
  mobilePhoneFormatted: string | null;
  address: string;
}

interface OrganizationType {
  name: string;
  GUID: string;
}

interface DepartmentType {
  name: string;
  GUID: string;
}

interface PositionType {
  name: string;
  GUID: string;
}

interface WorkScheduleType {
  name: string;
  GUID: string;
}

interface ExperienceType {
  companyYears: number;
  companyMonths: number;
}

interface EmployeeProfileType {
  fullName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  INN: string;
  SNILS: string;
  contacts: ContactsType;
  organization: OrganizationType;
  department: DepartmentType;
  position: PositionType;
  employmentDate: string;
  terminationDate: string;
  contractEndDate: string;
  contractType: string;
  contractDate: string;
  isFixedTerm: boolean;
  workSchedule: WorkScheduleType;
  mainPosition: boolean;
  vacationDays: number;
  experience: ExperienceType;
}

const formatDate = (dateString: string) => {
  if (!dateString || dateString.startsWith("0001-01-01")) return "-";
  try {
    return new Date(dateString).toLocaleDateString("ru-RU");
  } catch (e) {
    return "Неверная дата";
  }
};

const getInitials = (fullName: string | undefined | null): string => {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .map((n) => n?.[0] || '')
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default async function ProfilePage() {
  let employeeData: EmployeeProfileType | null = null;
  let error: string | null = null;

  try {
    employeeData = await callProxy<EmployeeProfileType>("/resources/me", "GET");
  } catch (e: any) {
    console.error("Failed to fetch employee data:", e);
    error = "Не удалось загрузить данные сотрудника.";
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!employeeData) {
    return <div className="p-6 text-muted-foreground">Загрузка данных...</div>;
  }

  const initials = getInitials(employeeData.fullName);

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-xl font-bold md:text-2xl">{employeeData.fullName}</h1>
                <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                  <Briefcase className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {employeeData.position?.name || "Должность не указана"}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                  <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {employeeData.organization?.name || "Организация не указана"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="mt-6">
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem label="Дата рождения" value={formatDate(employeeData.birthDate)} />
              <InfoItem label="ИНН" value={employeeData.INN} />
              <InfoItem label="СНИЛС" value={employeeData.SNILS} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="mt-6">
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
                <InfoItem label="Адрес" value={employeeData.contacts?.address} />
              </div>
              {employeeData.contacts?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
                  <InfoItem label="Email" value={employeeData.contacts.email} />
                </div>
              )}
              {employeeData.contacts?.mobilePhoneFormatted && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-1" />
                  <InfoItem label="Телефон" value={employeeData.contacts.mobilePhoneFormatted} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="mt-6">
              <CardTitle>Информация о работе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                <div className="space-y-4">
                  <InfoItem label="Департамент" value={employeeData.department?.name} />
                  <div>
                    <p className="text-sm text-muted-foreground">Должность</p>
                    <p className="font-medium">{employeeData.position?.name || "-"}</p>
                    {employeeData.mainPosition && (
                      <Badge variant="outline" className="mt-1">Основная должность</Badge>
                    )}
                  </div>
                  <InfoItem label="График работы" value={employeeData.workSchedule?.name} />
                </div>
                <div className="space-y-4">
                  <InfoItem label="Дата приема на работу" value={formatDate(employeeData.employmentDate)} />
                  <InfoItem label="Тип контракта" value={employeeData.contractType} />
                  <InfoItem label="Количество дней отпуска" value={`${employeeData.vacationDays ?? '-'} дней`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
