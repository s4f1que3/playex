import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbApi } from '../../utils/api';
import Spinner from '../common/Spinner';
import { AnimatePresence, motion } from 'framer-motion';

const VideosButton = ({ mediaType, mediaId, seasonNumber = null }) => {
  const [showVideos, setShowVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'theater'

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

      <AnimatePresence>
        {showVideos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => {
                setSelectedVideo(null);
                setShowVideos(false);
              }}
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[90vw] max-h-[90vh] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black via-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </motion.div>
                    <div>
                      <motion.h2 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-2xl font-bold text-white"
                      >
                        {videosData?.isSeason ? `Season ${videosData.seasonNumber} Videos` : 'Videos'}
                      </motion.h2>
                      <motion.p 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400"
                      >
                        {videosData?.results?.length || 0} videos available
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setViewMode(prev => prev === 'grid' ? 'theater' : 'grid')}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-300 group"
                    >
                      {viewMode === 'grid' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      )}
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        setSelectedVideo(null);
                        setShowVideos(false);
                      }}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors duration-300 group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="mt-24 p-6 overflow-y-auto max-h-[calc(90vh-96px)]">
                {isLoadingVideos ? (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-2 border-[#82BC87] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : videosData?.results?.length > 0 ? (
                  <AnimatePresence mode="wait">
                    {viewMode === 'grid' ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {videosData.results.map((video, index) => (
                          <motion.div
                            key={video.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
                            onClick={() => setSelectedVideo(video)}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                              alt={video.name}
                              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white font-medium line-clamp-2">{video.name}</p>
                                <p className="text-gray-300 text-sm mt-1">{video.type}</p>
                              </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-[#82BC87]/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {videosData.results.map((video, index) => (
                          <motion.div
                            key={video.key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`aspect-video rounded-xl overflow-hidden ${
                              selectedVideo?.key === video.key ? 'ring-2 ring-[#82BC87]' : ''
                            }`}
                          >
                            <iframe
                              className="w-full h-full"
                              src={`https://www.youtube.com/embed/${video.key}`}
                              title={video.name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            </motion.div>

            <AnimatePresence>
              {selectedVideo && viewMode === 'grid' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
                >
                  <div className="relative w-full max-w-5xl aspect-video">
                    <iframe
                      className="w-full h-full rounded-xl"
                      src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                      title={selectedVideo.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="absolute -top-12 right-0 p-2 text-white hover:text-[#82BC87] transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideosButton;
