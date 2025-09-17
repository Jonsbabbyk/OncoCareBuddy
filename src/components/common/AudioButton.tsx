import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { ttsService } from '../../services/ttsService';

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AudioButton: React.FC<AudioButtonProps> = ({ 
  text, 
  className = '',
  size = 'md'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const handlePlay = async () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setIsPlaying(true);

    try {
      await ttsService.speak(text);
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={isLoading}
      className={`inline-flex items-center space-x-2 ${buttonSizeClasses[size]} font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      aria-label={isPlaying ? 'Stop reading aloud' : 'Read aloud'}
    >
      {isLoading ? (
        <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${sizeClasses[size]}`} />
      ) : isPlaying ? (
        <Pause className={sizeClasses[size]} />
      ) : (
        <Volume2 className={sizeClasses[size]} />
      )}
      <span>{isPlaying ? 'Stop' : 'Read Aloud'}</span>
    </button>
  );
};