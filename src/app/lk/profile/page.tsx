'use server';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2, Briefcase, Clock, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { callProxy } from "@/lib/callProxy";
import { Suspense } from "react";

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
  if (dateString === "0001-01-01T00:00:00") return "Не указано";
  return new Date(dateString).toLocaleDateString("ru-RU");
};

const getInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export default async function ProfilePage() {
  const employeeData = await callProxy<any>("/resources/me", "GET");

  return (
    <div className="container mx-auto py-8">
        <div className="grid gap-6">
          {/* Основная информация */}
          <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-xl">
                  {getInitials(employeeData.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{employeeData.fullName}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employeeData.position.name}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employeeData.organization.name}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Личные данные */}
          <Card>
            <CardHeader>
              <CardTitle>Личные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Дата рождения</p>
                <p className="font-medium">{formatDate(employeeData.birthDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ИНН</p>
                <p className="font-medium">{employeeData.INN}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">СНИЛС</p>
                <p className="font-medium">{employeeData.SNILS}</p>
              </div>
            </CardContent>
          </Card>

          {/* Контактная информация */}
          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Адрес</p>
                  <p className="font-medium">{employeeData.contacts.address}</p>
                </div>
              </div>
              {employeeData.contacts.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{employeeData.contacts.email}</p>
                  </div>
                </div>
              )}
              {employeeData.contacts.mobilePhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="font-medium">{employeeData.contacts.mobilePhoneFormatted}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Информация о работе */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Информация о работе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Департамент</p>
                    <p className="font-medium">{employeeData.department.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Должность</p>
                    <p className="font-medium">{employeeData.position.name}</p>
                    {employeeData.mainPosition && (
                      <Badge className="mt-1">Основная должность</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">График работы</p>
                    <p className="font-medium">{employeeData.workSchedule.name}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Дата приема на работу</p>
                    <p className="font-medium">{formatDate(employeeData.employmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Тип контракта</p>
                    <p className="font-medium">{employeeData.contractType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Количество дней отпуска</p>
                    <p className="font-medium">{employeeData.vacationDays} дней</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
