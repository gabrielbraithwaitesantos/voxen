'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface CustomAudioPlayerProps {
  src: string;
}

const formatTime = (time: number) => {
  if (isNaN(time) || time === Infinity) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function CustomAudioPlayer({ src }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        if (isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const setAudioEnd = () => {
        setIsPlaying(false);
        audio.currentTime = 0;
      };

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', setAudioEnd);

      if (audio.readyState >= 1) {
        setAudioData();
      }
      
      setCurrentTime(0);
      setIsPlaying(false);

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', setAudioEnd);
      };
    }
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
       if (audio.currentTime >= audio.duration) {
         audio.currentTime = 0;
       }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Audio playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if(audioRef.current && isFinite(duration)) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }

  const progress = duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full items-center gap-2">
      <audio 
          ref={audioRef} 
          src={src} 
          preload="metadata"
          className="hidden"
      />
      <Button
          onClick={togglePlayPause}
          variant="default"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
      >
          {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current pl-0.5" />}
      </Button>
      <div className="w-full">
        <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="w-full"
        />
        <div className="flex w-full justify-end pr-1 mt-1">
            <span className="text-[0.65rem] text-muted-foreground font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
        </div>
      </div>
    </div>
  );
}
