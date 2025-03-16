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
        className="group relative overflow-hidden px-6 py-2.5 rounded-lg bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#82BC87]/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative flex items-center gap-2 text-gray-300 group-hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <span className="font-medium transform group-hover:translate-x-0.5 transition-transform duration-300">
            Videos
          </span>
        </span>
      </button>

      {showVideos && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                {videosData?.isSeason ? `Season ${videosData.seasonNumber} Videos` : 'Videos'}
              </h2>
              <button
                onClick={() => setShowVideos(false)}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors duration-300 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {isLoadingVideos ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : videosData?.results?.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {videosData.results.map(video => (
                    <div key={video.key} className="aspect-video rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-[#82BC87]/50 transition-all duration-300 transform hover:scale-[1.02]">
                      <iframe
                        className="w-full h-full"
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
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <p className="text-gray-400 text-lg">
                    No videos available{videosData?.isSeason ? ` for Season ${seasonNumber}` : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideosButton;
