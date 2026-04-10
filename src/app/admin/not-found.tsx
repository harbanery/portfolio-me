export default function AdminNotFound() {
  return (
    <div className="px-12 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">Page Not Found</p>
        <p className="text-gray-400 mb-8">
          This admin page is currently inactive, does not exist, or you don't have access to it.
        </p>
        <a
          href="/admin"
          className="px-6 py-3 bg-[#3a52dc] text-white rounded-lg hover:bg-[#2a42cc] transition-colors"
        >
          Back to Admin
        </a>
      </div>
    </div>
  );
}
