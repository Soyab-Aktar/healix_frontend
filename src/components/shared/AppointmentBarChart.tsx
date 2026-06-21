"use client"

import { BarChartData } from "@/types/dashboard.types"
import { format } from "date-fns"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface AppointmentBarChartProps {
  data: BarChartData[]
}

const chartConfig = {
  appointments: {
    label: "Appointments",
    color: "#047857",
  },
} satisfies ChartConfig

const AppointmentBarChart = ({ data }: AppointmentBarChartProps) => {
  const formattedData =
    Array.isArray(data) && data.length > 0
      ? data.map((item) => ({
          month:
            typeof item.month === "string"
              ? format(new Date(item.month), "MMM yy")
              : format(item.month, "MMM yy"),
          appointments: Number(item.count),
        }))
      : []

  const isEmpty =
    formattedData.length === 0 ||
    formattedData.every((item) => item.appointments === 0)

  // Compute totals for the footer
  const totalAppointments = formattedData.reduce(
    (acc, item) => acc + item.appointments,
    0
  )

  return (
    <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">
          Appointment Trends
        </CardTitle>
        <CardDescription className="text-slate-400 font-medium">
          Monthly appointment statistics
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <div className="flex items-center justify-center h-[280px]">
            <p className="text-sm text-slate-400 font-medium">
              No appointment data available.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart
              accessibilityLayer
              data={formattedData}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(4,120,87,0.06)", radius: 8 }}
                content={<ChartTooltipContent hideLabel={false} />}
              />
              <Bar
                dataKey="appointments"
                fill="var(--color-appointments)"
                radius={[6, 6, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      {!isEmpty && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0 pb-5 px-6">
          <div className="flex items-center gap-2 font-semibold text-slate-700 leading-none">
            <TrendingUp className="h-4 w-4 text-[#047857]" />
            {totalAppointments.toLocaleString()} total appointments tracked
          </div>
          <p className="text-xs text-slate-400 font-medium leading-none">
            Showing monthly booking data across all doctors
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

export default AppointmentBarChart