import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Bar Skeleton */}
        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>

        {/* Progress Card Skeleton */}
        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-6 w-full" />
          </div>
        </Card>

        {/* Stats Skeleton */}
        <div className="flex flex-wrap gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-32 rounded-xl" />
          ))}
        </div>

        {/* Subject Cards Skeleton */}
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-8">
              <div className="space-y-6">
                <Skeleton className="h-32 w-32 mx-auto rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TopicsSkeleton = () => {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>

        {/* Topic Cards Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-20 w-20 mx-auto rounded-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const QuizSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl p-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Question Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Options Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>

          {/* Progress Skeleton */}
          <Skeleton className="h-2 w-full" />
        </div>
      </Card>
    </div>
  );
};

export const RewardsSkeleton = () => {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-16 w-16 mx-auto rounded-full" />
                <Skeleton className="h-8 w-20 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </Card>
          ))}
        </div>

        {/* Badges Skeleton */}
        <Card className="p-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-24 w-24 mx-auto rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity Skeleton */}
        <Card className="p-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const SettingsSkeleton = () => {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        {/* Settings Cards Skeleton */}
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {/* Action Buttons Skeleton */}
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
