import { Card, CardContent, CardHeader } from "@/_components/ui/card";
import { Skeleton } from "@/_components/ui/skeleton";

export const GiftListSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-2 mb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};