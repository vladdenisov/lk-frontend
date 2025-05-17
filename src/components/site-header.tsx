"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Map of routes to their display names
const routeMap: Record<string, string> = {
  dashboard: "Главная",
  "personal-info": "Личная информация",
  "time-off": "Отсутствия",
  requests: "Заявки",
  timesheets: "Табели и графики",
  documents: "Документы на подпись",
  archive: "Архив документов",
  policies: "Регламенты компании",
  settings: "Настройки",
  admin: "Администрирование",
  "leave": "Заявка на отпуск",
  "users": "Сотрудники",
  'edit': 'Редактирование',
  'view': 'Просмотр',
};

function Breadcrumbs() {
  const pathname = usePathname();
  
  const { segments, displayNames } = useMemo(() => {
    const paths = pathname.split('/').filter(Boolean);
    const segments = paths.map((_, index) => {
      return '/' + paths.slice(0, index + 1).join('/');
    });

    const displayNames = paths.map(path => {
      return routeMap[path] || path;
    });

    return { segments, displayNames };
  }, [pathname]);

  // Handle empty paths or just '/lk'
  if (segments.length <= 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Главная</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, i) => {
          // Skip 'lk' segment in breadcrumbs display
          if (displayNames[i] === 'lk') return null;

          const isLastItem = i === segments.length - 1;

          return (
            <React.Fragment key={segment}>
              {i > 1 && <BreadcrumbSeparator />}
              <BreadcrumbItem className={i === 1 ? "hidden md:flex" : ""}>
                {isLastItem ? (
                  <BreadcrumbPage>{displayNames[i]}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={segment}>{displayNames[i]}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function SiteHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background transition-[height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex h-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>
    </header>
  )
}
