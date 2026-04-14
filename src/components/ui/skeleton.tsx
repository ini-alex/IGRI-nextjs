import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-ios-md bg-ios-surface-secondary",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
