"use client"

import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-emerald-100 p-8 shadow-lg shadow-emerald-500/5 space-y-6">
        <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Payment Confirmed!</h1>
          <p className="text-sm text-gray-500">
            Thank you. Your transaction was processed successfully and your appointment slot is secured.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-2">
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/dashboard/my-appointments">
              <Calendar className="mr-2 h-4 w-4" /> Go to My Appointments
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
