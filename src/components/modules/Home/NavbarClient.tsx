"use client";

import { logoutAction } from "@/app/(commonLayout)/(authRouteGroup)/logout/_action";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/types/user.type";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import {
  LogOut,
  Menu,
  User,
  LayoutGrid,
  X,
  ShieldCheck,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface NavbarClientProps {
  user: UserInfo | null;
}

const NavbarClient = ({ user }: NavbarClientProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = !!user;
  const dashboardRoute = user
    ? getDefaultDashboardRoute(user.role)
    : "/dashboard";

  // Handle scroll events to adjust spacing and backdrop opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent pointer-events-none">
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out pointer-events-auto",
          scrolled ? "pt-2" : "pt-4 md:pt-6"
        )}
      >
        <nav
          className={cn(
            "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-2xl md:rounded-[20px] px-6 h-16 flex items-center justify-between relative transition-all duration-300 ease-in-out",
            scrolled && "bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-slate-200/80 dark:border-slate-800/80 shadow-md"
          )}
        >
          {/* Left Section: Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-emerald-900/40 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#047857] dark:text-emerald-400" />
            </div>
            <span className="text-lg tracking-tight font-extrabold text-slate-900 dark:text-white">
              Healix
            </span>
          </Link>

          {/* Right Section: Links & Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Consultation Link */}
            <Link
              href="/consultation"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span>Consultation</span>
            </Link>

            {/* Theme Toggler */}
            <AnimatedThemeToggler className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100" />

            {/* User CTA Action */}
            {isLoggedIn ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-[#047857] hover:bg-[#035f43] text-white text-sm font-semibold px-4 py-2.5 h-10 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm border-0"
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-1 z-50"
                >
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 transition-colors"
                  >
                    <Link
                      href={dashboardRoute}
                      className="flex items-center w-full text-slate-700 dark:text-slate-300"
                    >
                      <LayoutGrid className="mr-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 transition-colors"
                  >
                    <Link
                      href="/my-profile"
                      className="flex items-center w-full text-slate-700 dark:text-slate-300"
                    >
                      <User className="mr-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800" />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={async () => {
                      await logoutAction();
                    }}
                    className="rounded-xl px-3 py-2.5 cursor-pointer flex items-center w-full"
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-[#047857] hover:bg-[#035f43] text-white font-semibold text-sm px-5 py-2.5 h-10 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm border-0"
                asChild
              >
                <Link href="/login">
                  <User className="h-4 w-4" />
                  <span>Log in / Register</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <AnimatedThemeToggler className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800" />
            <button
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Panel */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-18 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-4 space-y-3 z-50 md:hidden"
              >
                <Link
                  href="/consultation"
                  className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-150 py-2 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Calendar className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                  <span>Consultation</span>
                </Link>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl mb-3">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                        <span className="inline-block text-[10px] font-semibold text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md mt-2 border border-emerald-100 dark:border-emerald-900/60 capitalize">
                          {user.role.toLowerCase().replace("_", " ")}
                        </span>
                      </div>

                      <Link
                        href={dashboardRoute}
                        className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-[#047857] dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all font-medium text-sm"
                        onClick={() => setMenuOpen(false)}
                      >
                        <LayoutGrid className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/my-profile"
                        className="flex items-center gap-3 px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-[#047857] dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all font-medium text-sm"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <span>My Profile</span>
                      </Link>

                      <button
                        type="button"
                        onClick={async () => {
                          setMenuOpen(false);
                          await logoutAction();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all font-medium text-sm text-left cursor-pointer mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-[#047857] hover:bg-[#035f43] text-white font-semibold text-sm px-5 py-2.5 h-auto rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm border-0"
                      asChild
                    >
                      <Link href="/login" onClick={() => setMenuOpen(false)}>
                        <User className="h-4 w-4" />
                        <span>Log in / Register</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
};

export default NavbarClient;