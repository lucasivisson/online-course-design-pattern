import { cn } from "@/shared/utils";

interface StatItem {
  value: string;
  label: string;
  color?: "blue" | "green" | "purple" | "red" | "orange" | "gray";
}

interface StatsProps {
  items: StatItem[];
  className?: string;
}

const colorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  red: "text-red-600",
  orange: "text-orange-600",
  gray: "text-gray-600",
};

export function Stats({ items, className }: StatsProps) {
  return (
    <div
      className={cn(
        "flex justify-evenly bg-gray-50 py-6 rounded-lg",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <span
            className={cn(
              "text-2xl font-bold",
              colorClasses[item.color || "blue"]
            )}
          >
            {item.value}
          </span>
          <span className="text-sm text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
