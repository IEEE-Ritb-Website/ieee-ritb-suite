// Global loading fallback for lazy-loaded routes
export function GlobalLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  )
};
