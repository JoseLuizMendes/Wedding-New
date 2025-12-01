import { Card, CardContent, CardHeader } from "@/_components/ui/card";
import { Skeleton } from "@/_components/ui/skeleton";

/**
 * Skeleton loading state for forms (RSVP form, etc.)
 */
export const FormSkeleton = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Phone field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Message field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-24 w-full" />
        </div>
        {/* Submit button */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export default FormSkeleton;
