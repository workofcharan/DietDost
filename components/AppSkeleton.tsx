export default function AppSkeleton() {
  return (
    <div className="min-h-screen px-6 pb-12 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="glass-card p-6">
            <div className="skeleton mb-5 h-8 w-48" />
            <div className="skeleton mb-3 h-5 w-full" />
            <div className="skeleton mb-8 h-5 w-3/4" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="skeleton h-28" />
              <div className="skeleton h-28" />
              <div className="skeleton h-28" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="glass-card p-6">
            <div className="skeleton mb-5 h-8 w-36" />
            <div className="skeleton mb-3 h-24 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
