const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-primary-500/20" />
        </div>
      </div>
    </div>
  );
};

export const RestaurantCardSkeleton = () => (
  <div className="card p-4">
    <div className="skeleton h-48 w-full rounded-xl mb-4" />
    <div className="skeleton h-6 w-3/4 rounded mb-2" />
    <div className="skeleton h-4 w-1/2 rounded mb-3" />
    <div className="flex justify-between">
      <div className="skeleton h-4 w-16 rounded" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
  </div>
);

export default LoadingScreen;