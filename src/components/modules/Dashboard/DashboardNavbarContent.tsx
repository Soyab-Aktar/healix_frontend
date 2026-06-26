"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.type";
import { Menu, Search, KeyRound, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
interface DashboardNavbarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string
}

const DashboardNavbarContent = ({ dashboardHome, navItems, userInfo }: DashboardNavbarProps) => {

  const pathname = usePathname();
  const router = useRouter();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    // Show password change prompt modal strictly if:
    // 1. User needs password change
    // 2. We are not on the change-password page itself
    if (userInfo?.needPasswordChange && pathname !== "/change-password") {
      setShowPasswordPrompt(true);
    } else {
      setShowPasswordPrompt(false);
    }
  }, [userInfo, pathname]);

  const handleRedirect = () => {
    router.push("/change-password");
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768);
    }

    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);

    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 w-full px-6 py-3 border-b border-slate-100 bg-white/85 backdrop-blur-md justify-between md:justify-end">
      {/* Mobile Menu Toggle Button And Menu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-500 hover:text-[#047857] hover:bg-emerald-50/50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0">
          <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems} />
        </SheetContent>
      </Sheet>


      {/* Search Component */}
      {/* <div className="flex-1 flex items-center">
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Search..." className="pl-9 pr-4" />
        </div>
      </div> */}


      {/* Right Side Actions */}
      <div className="flex items-center gap-2 ">
        {/* Notification */}
        <NotificationDropdown />

        {/* User Dropdown  */}
        <UserDropdown userInfo={userInfo} />
      </div>

      {/* Password Change Modal Prompt */}
      <Dialog open={showPasswordPrompt} onOpenChange={() => {}}>
        <DialogContent 
          className="max-w-md p-0 overflow-hidden border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900" 
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="p-6 text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30">
              <KeyRound className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 text-center">
                Security Update Required
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto font-medium text-center">
                For your account's privacy and data security, please update the temporary password set by the administrator.
              </DialogDescription>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/40 px-6 py-4 flex flex-col justify-center border-t border-slate-100 dark:border-slate-800">
            <Button
              onClick={handleRedirect}
              className="w-full bg-[#047857] hover:bg-[#035f43] text-white h-11 rounded-xl font-semibold cursor-pointer shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 animate-none"
            >
              <span>Go to Change Password</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardNavbarContent