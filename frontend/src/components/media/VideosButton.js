import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';
import Spinner from '../common/Spinner';

const VideosButton = ({ mediaType, mediaId, seasonNumber = null }) => {
  const [showVideos, setShowVideos] = useState(false);

  const { data: videosData, isLoading: isLoadingVideos } = useQuery({
    queryKey: ['videos', mediaType, mediaId, seasonNumber],
    queryFn: async () => {
      if (mediaType === 'tv' && seasonNumber) {
        const seasonVideos = await tmdbApi.get(`/tv/${mediaId}/season/${seasonNumber}/videos`).then(res => res.data);
        if (seasonVideos.results?.length > 0) {
          return {
            ...seasonVideos,
            isSeason: true,
            seasonNumber
          };
        }
      }
      return tmdbApi.get(`/${mediaType}/${mediaId}/videos`).then(res => ({
        ...res.data,
        isSeason: false
      }));
    },
    staleTime: 300000
  });

  return (
    <>
      <button
        onClick={() => setShowVideos(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
        Videos
      </button>

      {showVideos && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {videosData?.isSeason ? `Season ${videosData.seasonNumber} Videos` : 'Videos'}
              </h2>
              <button
                onClick={() => setShowVideos(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {isLoadingVideos ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : videosData?.results?.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {videosData.results.map(video => (
                    <div key={video.key} className="aspect-video">
                      <iframe
                        className="w-full h-full rounded"
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No videos available{videosData?.isSeason ? ` for Season ${seasonNumber}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideosButton;
