import { cn } from "@/shared/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  index: number;
}

export function StatCard({ index, title, value, icon }: StatCardProps) {
  const getRandomBackgroundColorBasedOnIndex = (index: number) => {
    const colorPairs = [
      { bg: "bg-yellow-500/20", text: "text-yellow-700" },
      { bg: "bg-green-500/20", text: "text-green-700" },
      { bg: "bg-pink-500/20", text: "text-pink-700" },
      { bg: "bg-blue-500/20", text: "text-blue-700" },
      { bg: "bg-indigo-500/20", text: "text-indigo-700" },
      { bg: "bg-red-500/20", text: "text-red-700" },
      { bg: "bg-orange-500/20", text: "text-orange-700" },
    ];
    return colorPairs[index % colorPairs.length];
  };

  const colors = getRandomBackgroundColorBasedOnIndex(index);

  return (
    <div className="p-6 flex min-w-96 flex-1 justify-between items-center bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-3xl font-bold text-black">{value}</span>
      </div>
      <div
        className={cn(
          "flex rounded-full p-3 items-center gap-2",
          colors.bg,
          colors.text
        )}
      >
        {icon}
      </div>
    </div>
  );
}
