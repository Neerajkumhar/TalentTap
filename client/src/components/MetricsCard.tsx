import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  color: "primary" | "secondary" | "warning" | "success" | "error";
  loading?: boolean;
}

export default function MetricsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  color,
  loading = false,
}: MetricsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-50 text-primary-500";
      case "secondary":
        return "bg-secondary-50 text-secondary-500";
      case "warning":
        return "bg-warning-50 text-warning-500";
      case "success":
        return "bg-success-50 text-success-500";
      case "error":
        return "bg-error-50 text-error-500";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-success-500";
      case "negative":
        return "text-error-500";
      default:
        return "text-warning-500";
    }
  };

  if (loading) {
    return (
      <Card className="material-elevation-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="material-elevation-1 hover-elevation transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${getChangeColor(changeType)}`}>
                {changeType === "positive" && "↗ "}
                {changeType === "negative" && "↘ "}
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
            <span className="material-icons">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
