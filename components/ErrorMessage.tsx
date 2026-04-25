"use client";

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-8" role="alert">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-red-400 font-semibold mb-2">Error Loading Videos</h2>
          <p className="text-red-300 mb-4">{message}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}