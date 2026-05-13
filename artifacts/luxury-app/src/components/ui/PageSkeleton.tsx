import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardPageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 md:p-8 max-w-5xl space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" style={{ background: "rgba(212,175,55,0.08)" }} />
        <Skeleton className="h-8 w-64" style={{ background: "rgba(212,175,55,0.1)" }} />
        <Skeleton className="h-3 w-48" style={{ background: "rgba(212,175,55,0.06)" }} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-md"
            style={{ background: "rgba(212,175,55,0.06)" }}
          />
        ))}
      </div>

      {/* Content row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-20 rounded-md"
              style={{ background: "rgba(212,175,55,0.06)" }}
            />
          ))}
        </div>
        <Skeleton
          className="lg:col-span-2 h-64 rounded-md"
          style={{ background: "rgba(212,175,55,0.06)" }}
        />
      </div>
    </motion.div>
  );
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="relative overflow-hidden rounded-sm" style={{ height }}>
      <Skeleton className="absolute inset-0" style={{ background: "rgba(212,175,55,0.06)" }} />
      {/* Fake bars */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end gap-2 px-4 pb-4">
        {[60, 90, 45, 75, 55, 85, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm animate-pulse"
            style={{
              height: `${h}%`,
              background: `rgba(212,175,55,${0.04 + i * 0.01})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-40 rounded-md"
          style={{ background: "rgba(212,175,55,0.06)" }}
        />
      ))}
    </div>
  );
}
