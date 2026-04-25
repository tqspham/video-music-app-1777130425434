import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import VideoGrid from '@/components/VideoGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';

interface SearchParams {
  search?: string;
}

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
}

interface ApiResponse {
  videos: Video[];
  total: number;
}

async function fetchVideos(search?: string): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  
  const response = await fetch(
    `${baseUrl}/api/videos?${params.toString()}`,
    { cache: 'no-store' }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  
  return response.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = params.search || '';
  
  let videos: Video[] = [];
  let error: string | null = null;
  let isLoading = false;

  try {
    const data = await fetchVideos(search);
    videos = data.videos;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred';
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Music Videos</h1>
        
        <div className="mb-12">
          <SearchBar isLoading={isLoading} onSearch={() => {}} />
        </div>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => window.location.reload()}
          />
        )}

        {!error && videos.length === 0 && search && (
          <EmptyState message="No videos match your search. Try a different query." />
        )}

        {!error && videos.length === 0 && !search && (
          <LoadingSpinner />
        )}

        {!error && videos.length > 0 && (
          <VideoGrid videos={videos} onVideoClick={() => {}} />
        )}
      </div>
    </div>
  );
}