"use client"

import * as React from "react"
import Link from "next/link";
import { usePathname } from "next/navigation"; // To determine active link
import {
  LayoutDashboard, // Dashboard
  User, // Personal Info
  CalendarClock, // Time Off
  Send, // Requests
  Clock, // Timesheets / Schedules
  FileSignature, // Documents (EDM)
  Archive, // Archive
  BookOpen, // Company Policies
  Settings2, // Settings
  ShieldCheck, // Admin Panel
  Command, // Existing icon
} from "lucide-react"

import { useAuth } from "@/context/auth-context"; // Import useAuth
import { NavUser } from "@/components/nav-user"
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading, refetchUser } = useAuth();
  const pathname = usePathname();
  const { isMobile } = useSidebar(); // Get mobile state

  useEffect(() => {
    refetchUser();
  }, []);

  const navItems = [
    { title: "Главная", href: "/lk/dashboard", icon: LayoutDashboard },
    { title: "Личная информация", href: "/lk/personal-info", icon: User },
    { title: "Отсутствия", href: "/lk/time-off", icon: CalendarClock },
    { title: "Заявки на отпуск", href: "/lk/requests/leave", icon: Send },
    { title: "Табели и графики", href: "/lk/timesheets", icon: Clock },
    { title: "Документы на подпись", href: "/lk/documents", icon: FileSignature },
    { title: "Архив документов", href: "/lk/archive", icon: Archive },
    { title: "Регламенты компании", href: "/lk/policies", icon: BookOpen },
    { title: "Настройки", href: "/lk/settings", icon: Settings2 },
  ];

  if (user?.roles.includes('manager')) {
    navItems.push({ title: "Заявки Сотрудников", href: "/lk/manager/requests", icon: Send });
  }

  const adminNavItems = [
    { title: "Панель Администратора", href: "/lk/admin/users", icon: ShieldCheck },
  ];


  return (
    <Sidebar
      collapsible="icon"
      className="border-r"
      {...props}
    >
      <SidebarHeader className="border-b p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    className="flex justify-start h-12 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12"
                    tooltip="Главная"
                  >
                    <Link href="/lk/dashboard" className="flex items-center">
                      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-6">
                        <Command className="size-4 group-data-[collapsible=icon]:size-4" />
                      </div>
                      <div className="ml-3 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-semibold">ЛК Сотрудника</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="hidden group-data-[collapsible=icon]:flex">
                  Главная
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="px-1.5 py-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title} className="my-0.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "justify-start h-10 px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10",
                          pathname === item.href && "bg-muted text-foreground"
                        )}
                        tooltip={item.title}
                      >
                        <Link href={item.href} className="flex items-center">
                          <item.icon className="size-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="hidden group-data-[collapsible=icon]:flex">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Conditional Admin Panel Link */}
        {user?.roles.includes('admin') && (
          <SidebarGroup className="mt-auto border-t">
            <SidebarMenu className="px-1.5">
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title} className="my-0.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            "justify-start h-10 px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10",
                            pathname.startsWith(item.href) && "bg-muted text-foreground"
                          )}
                          tooltip={item.title}
                        >
                          <Link href={item.href} className="flex items-center">
                            <item.icon className="size-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="hidden group-data-[collapsible=icon]:flex">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t p-0">
        {isLoading ? (
          <div className="flex items-center gap-3 p-3 group-data-[collapsible=icon]:justify-center">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ) : user ? (
          <NavUser user={user} />
        ) : (
          <div className="p-3 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
            Не авторизован
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
