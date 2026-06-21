import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { createElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: string;
  description?: string
  className?: string;
}


const StatsCard = ({ title, value, iconName, description, className }: StatsCardProps) => {
  return (
    <Card className={cn("hover:scale-[1.02] hover:shadow-md transition-all duration-250 border-slate-200/60 rounded-[20px] shadow-sm bg-white", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold text-slate-500">{title}</CardTitle>
        <div className="h-9 w-9 rounded-[12px] bg-emerald-50 text-[#047857] flex items-center justify-center">
          {createElement(getIconComponent(iconName), { className: "w-5 h-5" })}
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        <div className="text-2xl font-extrabold text-slate-800">{value}</div>
        {
          description && (
            <p className="text-xs text-slate-400 font-medium">
              {description}
            </p>
          )
        }
      </CardContent>
    </Card>
  );
}

export default StatsCard;