"use client";

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
}

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const minutes = Math.floor(video.duration / 60);
  const seconds = video.duration % 60;
  const durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <button
      onClick={onClick}
      className="group cursor-pointer text-left transition-transform hover:scale-105 active:scale-95"
      aria-label={`${video.title} by ${video.artist}`}
    >
      <div className="relative overflow-hidden rounded-lg bg-slate-700 aspect-video">
        <img
          src={video.thumbnailUrl}
          alt={`${video.title} thumbnail`}
          className="w-full h-full object-cover group-hover:brightness-75 transition-all"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs font-semibold">
          {durationText}
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-gray-300 truncate">{video.artist}</p>
      </div>
    </button>
  );
}