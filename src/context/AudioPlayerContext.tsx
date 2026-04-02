import React, { createContext, useContext, useRef, useState } from "react";
import { createAudioPlayer, AudioPlayer } from "expo-audio";

type AudioContextType = {
  currentUri: string | null;
  isPlaying: boolean;
  position: number;
  duration: number;

  play: (uri: string) => void;
  pause: () => void;
  toggle: (uri: string) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudioPlayerContext = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("AudioContext not found");
  return ctx;
};

export const AudioPlayerProvider = ({ children }: any) => {

  const playerRef = useRef<AudioPlayer | null>(null);

  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const intervalRef = useRef<any>(null);

  const startTracking = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;

      setIsPlaying(p.playing);
      setPosition(p.currentTime);
      setDuration(p.duration ?? 0);

      if (p.duration && p.currentTime >= p.duration) {
        p.seekTo(0);
        setIsPlaying(false);
        setCurrentUri(null);
      }
    }, 300);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const play = (uri: string) => {
    // 🔥 Stop previous
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.seekTo(0);
    }

    const player = createAudioPlayer({ uri });
    playerRef.current = player;

    setCurrentUri(uri);

    player.play();
    startTracking();
  };

  const pause = () => {
    const p = playerRef.current;
    if (!p) return;

    p.pause();
    setIsPlaying(false);
  };

  const toggle = (uri: string) => {
    const p = playerRef.current;

    if (currentUri === uri && p) {
      if (p.playing) {
        pause();
      } else {
        p.play();
        setIsPlaying(true);
      }
    } else {
      play(uri);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentUri,
        isPlaying,
        position,
        duration,
        play,
        pause,
        toggle,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};