"use client";

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
}

interface VideoInfoProps {
  video: Video;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const minutes = Math.floor(video.duration / 60);
  const seconds = video.duration % 60;
  const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="mt-6">
      <h1 
        className="text-3xl font-bold text-white mb-2"
        role="heading"
        aria-level={1}
      >
        {video.title}
      </h1>
      
      <p 
        className="text-xl text-gray-300 mb-4"
        role="doc-subtitle"
        aria-label={`Artist: ${video.artist}`}
      >
        by {video.artist}
      </p>
      
      <div className="flex items-center gap-4 text-gray-400">
        <span className="text-sm">Duration: {durationText}</span>
      </div>
    </div>
  );
}