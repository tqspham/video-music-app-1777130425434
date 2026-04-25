export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        </div>
        <p className="text-gray-300 text-lg">Loading videos...</p>
      </div>
    </div>
  );
}