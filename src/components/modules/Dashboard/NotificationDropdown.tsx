"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, CheckCircle, Clock, UserPlus } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "schedule" | "system" | "user";
  timestamp: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Appointment Scheduled",
    message: "You have a new appointment scheduled with John Doe on 2024-06-15 at 10:00 AM.",
    type: "appointment",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: "2",
    title: "Schedule Updated",
    message: "Your schedule has been updated for the week of 2024-06-17.",
    type: "schedule",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true
  },
  {
    id: "3",
    title: "System Maintenance",
    message: "The system will undergo maintenance on 2024-06-20 from 1:00 AM to 3:00 AM.",
    type: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false
  },
  {
    id: "4",
    title: "New User Registered",
    message: "A new user, Jane Smith, has registered on the platform.",
    type: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true
  }
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "appointment":
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50 text-[#047857] shrink-0">
          <Calendar className="h-4 w-4" />
        </div>
      );
    case "schedule":
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-teal-50 text-teal-600 shrink-0">
          <Clock className="h-4 w-4" />
        </div>
      );
    case "system":
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 text-slate-600 shrink-0">
          <CheckCircle className="h-4 w-4" />
        </div>
      );
    case "user":
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 shrink-0">
          <UserPlus className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 text-slate-600 shrink-0">
          <Bell className="h-4 w-4" />
        </div>
      );
  }
}

const NotificationDropdown = () => {
  const unreadCount = MOCK_NOTIFICATIONS.filter(notification => !notification.read).length;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-xl border-slate-200 text-slate-500 hover:text-[#047857] hover:bg-emerald-50/50">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-rose-500 border border-white text-white shadow-sm" variant="destructive">
            <span className="text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 rounded-2xl border-slate-200/80 p-1.5 shadow-xl shadow-slate-100/50 bg-white">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-700">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-emerald-50 text-[#047857] border-emerald-100 font-semibold rounded-full px-2 py-0.5 text-[10px]">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-100 my-1" />

        <ScrollArea className="h-75">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map(notification => (
              <DropdownMenuItem key={notification.id} className="flex flex-row items-start gap-3 p-3 cursor-pointer rounded-xl transition-colors hover:bg-slate-50 focus:bg-slate-50">
                {getNotificationIcon(notification.type)}

                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-sm font-bold text-slate-800 leading-tight truncate">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>

                  <p className="text-[10px] text-slate-400 font-semibold">
                    {formatDistanceToNow(notification.timestamp, {
                      addSuffix: true
                    })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-slate-400 font-medium">
              No notifications
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator className="bg-slate-100 my-1" />

        <DropdownMenuItem className="text-center justify-center cursor-pointer font-bold text-xs text-[#047857] hover:text-[#035f43] focus:text-[#035f43] rounded-xl py-2 hover:bg-emerald-50/50 focus:bg-emerald-50/50">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown