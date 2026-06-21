"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/types/user.type"
import { Key, LogOut, User } from "lucide-react"
import Link from "next/link"
import { logoutAction } from "@/app/(commonLayout)/(authRouteGroup)/logout/_action"

interface UserDropdownProps {
  userInfo: UserInfo
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full h-9 w-9 bg-emerald-50 text-[#047857] border-emerald-100 hover:bg-emerald-100/50 hover:text-[#035f43] font-bold">
          {userInfo.name.charAt(0).toUpperCase()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-200/80 p-1.5 shadow-xl shadow-slate-100/50 bg-white">
        <DropdownMenuLabel className="px-3 py-2 flex flex-col space-y-1">
          <p className="text-sm font-bold text-slate-800">
            {userInfo.name}
          </p>
          <p className="text-xs text-slate-400 font-semibold">
            {userInfo.email}
          </p>
          <p className="text-xs text-[#047857] font-semibold capitalize">
            {userInfo.role.toLowerCase().replace("_", " ")}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-100 my-1" />

        <DropdownMenuItem asChild>
          <Link href="/my-profile" className="flex items-center gap-2.5 w-full text-slate-600 hover:text-slate-900 cursor-pointer font-bold text-xs rounded-xl px-3 py-2 hover:bg-emerald-50/50 focus:bg-emerald-50/50 transition-colors">
            <User className="h-4 w-4 text-[#047857]" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/change-password" className="flex items-center gap-2.5 w-full text-slate-600 hover:text-slate-900 cursor-pointer font-bold text-xs rounded-xl px-3 py-2 hover:bg-emerald-50/50 focus:bg-emerald-50/50 transition-colors">
            <Key className="h-4 w-4 text-[#047857]" />
            <span>Change Password</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-100 my-1" />

        <DropdownMenuItem onClick={async () => { await logoutAction(); }} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50/50 focus:bg-red-50/50 font-bold text-xs rounded-xl px-3 py-2 flex items-center gap-2.5 transition-colors">
          <LogOut className="h-4 w-4 text-red-500" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown