
import React from 'react';

interface VideoPlayerProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  className = "", 
  autoPlay = true, 
  muted = true, 
  loop = true, 
  playsInline = true 
}) => {
  // Helper to detect YouTube
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeID = getYouTubeID(url);

  if (youtubeID) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeID}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${youtubeID}&controls=0&modestbranding=1&rel=0`;
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <iframe
          className="absolute top-0 left-0 w-full h-full pointer-events-none scale-110"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        />
      </div>
    );
  }

  return (
    <video 
      src={url} 
      className={className} 
      autoPlay={autoPlay} 
      muted={muted} 
      loop={loop} 
      playsInline={playsInline} 
    />
  );
};

export default VideoPlayer;
