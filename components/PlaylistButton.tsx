"use client";

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface PlaylistButtonProps {
  videoId: string;
  isFavorited: boolean;
  onToggle: (videoId: string) => void;
}

export default function PlaylistButton({
  videoId,
  isFavorited: initialFavorited,
  onToggle,
}: PlaylistButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const playlist = localStorage.getItem('playlist');
    const videoIds = playlist ? JSON.parse(playlist) : [];
    setIsFavorited(videoIds.includes(videoId));
    setIsHydrated(true);
  }, [videoId]);

  const handleToggle = () => {
    const playlist = localStorage.getItem('playlist');
    const videoIds: string[] = playlist ? JSON.parse(playlist) : [];
    
    let newFavorited: boolean;
    if (isFavorited) {
      newFavorited = false;
      const index = videoIds.indexOf(videoId);
      if (index > -1) {
        videoIds.splice(index, 1);
      }
    } else {
      newFavorited = true;
      videoIds.push(videoId);
    }
    
    localStorage.setItem('playlist', JSON.stringify(videoIds));
    setIsFavorited(newFavorited);
    onToggle(videoId);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      className={twMerge(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all',
        isFavorited
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20'
      )}
      aria-label={isFavorited ? 'Remove from playlist' : 'Add to playlist'}
      aria-pressed={isFavorited}
    >
      <Heart
        className={twMerge('w-5 h-5', isFavorited && 'fill-current')}
      />
      {isFavorited ? 'Remove from Playlist' : 'Add to Playlist'}
    </button>
  );
}