"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SheetTitle } from "@/components/ui/sheet"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.types"
import { UserInfo } from "@/types/user.type"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck } from "lucide-react"

interface DashboardMobileSidebarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({ dashboardHome, navItems, userInfo }: DashboardMobileSidebarProps) => {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col bg-white overflow-y-auto">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <Link href={dashboardHome}>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d9488] to-[#047857] text-white shadow-md shadow-emerald-700/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800">Healix</span>
          </div>
        </Link>
      </div>

      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 group",
                        isActive
                          ? "bg-[#047857] text-white shadow-md shadow-emerald-500/10"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50",
                      )}
                    >
                      <Icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4 bg-slate-100" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-50 text-[#047857] border border-emerald-100/50 flex items-center justify-center font-bold">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{userInfo.name}</p>
            <p className="text-xs text-slate-400 font-semibold capitalize">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMobileSidebar