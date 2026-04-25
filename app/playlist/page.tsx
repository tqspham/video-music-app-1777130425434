"use client";

import { useEffect, useState } from 'react';
import PlaylistGrid from '@/components/PlaylistGrid';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
}

export default function PlaylistPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlaylist = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const playlist = localStorage.getItem('playlist');
        const videoIds: string[] = playlist ? JSON.parse(playlist) : [];

        if (videoIds.length === 0) {
          setVideos([]);
          setIsLoading(false);
          return;
        }

        const videoPromises = videoIds.map((id) =>
          fetch(`/api/videos/${id}`).then((res) => res.json())
        );

        const results = await Promise.all(videoPromises);
        const loadedVideos = results.map((result) => result.video).filter(Boolean);
        setVideos(loadedVideos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load playlist');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylist();
  }, []);

  const handleRemove = (videoId: string) => {
    const playlist = localStorage.getItem('playlist');
    const videoIds: string[] = playlist ? JSON.parse(playlist) : [];
    const filtered = videoIds.filter((id) => id !== videoId);
    localStorage.setItem('playlist', JSON.stringify(filtered));
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">My Playlist</h1>

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {isLoading && <LoadingSpinner />}

        {!error && !isLoading && videos.length === 0 && (
          <EmptyState message="Your playlist is empty. Add videos to get started!" />
        )}

        {!error && !isLoading && videos.length > 0 && (
          <PlaylistGrid videos={videos} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
}