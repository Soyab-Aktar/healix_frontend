"use client"

import { PieChartData } from "@/types/dashboard.types"
import { Cell, Pie, PieChart } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface AppointmentPieChartProps {
  data: PieChartData[]
  title?: string
  description?: string
}

// Emerald-anchored palette that visually harmonises with the theme
const SLICE_COLORS = [
  "#047857", // emerald-700
  "#059669", // emerald-600
  "#34d399", // emerald-400
  "#0d9488", // teal-600
  "#f59e0b", // amber-400  – stands out for contrasting statuses
]

const AppointmentPieChart = ({
  data,
  title = "Appointments Distribution",
  description = "Visual status summary",
}: AppointmentPieChartProps) => {
  const formattedData = Array.isArray(data)
    ? data.map((item, index) => ({
        name: item.status
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (c: string) => c.toUpperCase()),
        value: Number(item.count),
        fill: SLICE_COLORS[index % SLICE_COLORS.length],
      }))
    : []

  const isEmpty =
    formattedData.length === 0 ||
    formattedData.every((item) => item.value === 0)

  // Build a ChartConfig keyed by formatted name so the legend renders labels
  const chartConfig: ChartConfig = Object.fromEntries(
    formattedData.map((item, index) => [
      item.name,
      {
        label: item.name,
        color: SLICE_COLORS[index % SLICE_COLORS.length],
      },
    ])
  )

  const totalAppointments = formattedData.reduce(
    (acc, item) => acc + item.value,
    0
  )

  return (
    <Card className="rounded-[24px] border-slate-200/60 shadow-sm bg-white w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-400 font-medium">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        {isEmpty ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-sm text-slate-400 font-medium">
              No appointment data available.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={formattedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                strokeWidth={2}
                stroke="#fff"
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>

      {!isEmpty && (
        <CardFooter className="flex-col items-center gap-1 pt-3 pb-5 text-sm">
          <p className="font-extrabold text-slate-800 text-base">
            {totalAppointments.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            Total appointments across all statuses
          </p>
        </CardFooter>
      )}
    </Card>
  )
}

export default AppointmentPieChart