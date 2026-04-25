"use client";

import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export default function VideoPlayer({
  videoUrl,
  title,
  onClose,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (isPlaying) {
            videoRef.current.pause();
          } else {
            videoRef.current.play();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(
            videoRef.current.currentTime + 5,
            duration
          );
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(
            videoRef.current.currentTime - 5,
            0
          );
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            handleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration, isFullscreen]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {}
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden aspect-video group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        title={title}
        preload="metadata"
      />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors"
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className={twMerge(
          'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none transition-opacity duration-300',
          !showControls && 'opacity-0'
        )}
      />

      <div
        className={twMerge(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300',
          !showControls && 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-white/20 rounded cursor-pointer accent-blue-600"
            aria-label="Seek through video"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-blue-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="text-white hover:text-blue-400 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded cursor-pointer accent-blue-600"
                aria-label="Volume control"
              />
            </div>

            <span className="text-white text-sm whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={handleFullscreen}
            className="text-white hover:text-blue-400 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        <div className="text-white text-xs mt-3 opacity-75">
          <p>Shortcuts: Space (play/pause) · Arrow keys (seek) · F (fullscreen)</p>
        </div>
      </div>
    </div>
  );
}