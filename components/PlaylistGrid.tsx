"use client";

import { useRouter } from 'next/navigation';
import VideoCard from '@/components/VideoCard';

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
}

interface PlaylistGridProps {
  videos: Video[];
  onRemove: (videoId: string) => void;
}

export default function PlaylistGrid({ videos, onRemove }: PlaylistGridProps) {
  const router = useRouter();

  const handleVideoClick = (id: string) => {
    router.push(`/videos/${id}`);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="relative">
            <VideoCard
              video={video}
              onClick={() => handleVideoClick(video.id)}
            />
            <button
              onClick={() => onRemove(video.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              aria-label={`Remove ${video.title} from playlist`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}