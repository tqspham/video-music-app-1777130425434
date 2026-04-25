"use client";

import { Music } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-300 text-lg">{message}</p>
      </div>
    </div>
  );
}