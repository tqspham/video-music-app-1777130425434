"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import VideoInfo from '@/components/VideoInfo';
import PlaylistButton from '@/components/PlaylistButton';
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

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VideoDetailPage({ params }: VideoDetailPageProps) {
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchVideo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/videos/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        const data = await response.json();
        setVideo(data.video);

        const playlist = localStorage.getItem('playlist');
        const videoIds = playlist ? JSON.parse(playlist) : [];
        setIsFavorited(videoIds.includes(resolvedParams.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [resolvedParams]);

  const handleRetry = () => {
    if (resolvedParams) {
      window.location.reload();
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
        <div className="container mx-auto px-4">
          <ErrorMessage message={error || 'Video not found'} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={handleClose}
          className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          ← Back
        </button>

        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            videoId={video.id}
            videoUrl={video.videoUrl}
            title={video.title}
            onClose={handleClose}
          />

          <VideoInfo video={video} />

          <div className="mt-8">
            <PlaylistButton
              videoId={video.id}
              isFavorited={isFavorited}
              onToggle={handleToggleFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  );
}