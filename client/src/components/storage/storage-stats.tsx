import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { PlanLimits } from "@shared/schema";
import { formatFileSize } from "@/lib/utils";

interface StorageStatsProps {
  usage: {
    used: number;
    total: number;
  };
}

export default function StorageStats({ usage }: StorageStatsProps) {
  const { user } = useAuth();

  const getStorageTotalForPlan = () => {
    if (!user) return 0;
    return PlanLimits[user.plan as keyof typeof PlanLimits].storage;
  };

  const usedPercentage = Math.min(
    100,
    Math.round((usage.used / getStorageTotalForPlan()) * 100)
  );

  const getPlanStorageLabel = () => {
    if (!user) return "0";
    
    switch (user.plan) {
      case "pro":
        return "4 TB";
      case "basic":
        return "100 GB";
      default:
        return "15 GB";
    }
  };

  const getColorForUsage = () => {
    if (usedPercentage >= 90) return "bg-red-500";
    if (usedPercentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between mb-1">
            <div>
              <p className="text-sm font-medium">Used Storage</p>
              <p className="text-2xl font-bold">{formatFileSize(usage.used)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Total Storage</p>
              <p className="text-2xl font-bold">{getPlanStorageLabel()}</p>
            </div>
          </div>
          
          <Progress
            value={usedPercentage}
            className="h-2"
            indicatorClassName={getColorForUsage()}
          />
          
          <p className="text-sm text-gray-500 text-right">
            {usedPercentage}% used
          </p>
          
          {usedPercentage >= 85 && (
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              Your storage is almost full. Consider upgrading your plan or removing unused files.
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Plan Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Current Plan:</div>
              <div className="font-medium capitalize">{user?.plan || "Free"}</div>
              
              <div>Storage:</div>
              <div className="font-medium">{getPlanStorageLabel()}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
