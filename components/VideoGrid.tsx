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

interface VideoGridProps {
  videos: Video[];
  onVideoClick: (id: string) => void;
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const router = useRouter();

  const handleVideoClick = (id: string) => {
    router.push(`/videos/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onClick={() => handleVideoClick(video.id)}
        />
      ))}
    </div>
  );
}