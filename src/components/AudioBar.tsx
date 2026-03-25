
import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createAudioPlayer, AudioPlayer } from "expo-audio";

type Props = {
  uri: string;
  call_duration_hms: string;
};

export const AudioBar = ({ uri, call_duration_hms }: Props) => {
  const playerRef = useRef<AudioPlayer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [positionSec, setPositionSec] = useState(0);

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Load player
  const loadAudio = () => {
    if (playerRef.current) return;

    const player = createAudioPlayer({ uri });
    playerRef.current = player;

    // Manual sync loop (expo-audio way)
    const interval = setInterval(() => {
      if (!playerRef.current) return;

      const p = playerRef.current;

      setIsPlaying(p.playing);
      setPositionSec(p.currentTime);

      // Detect finish manually
      if (p.duration && p.currentTime >= p.duration) {
        p.seekTo(0);
        setIsPlaying(false);
      }
    }, 300);

    // store interval for cleanup
    // (player as any).__interval = interval;
    
  };

  const handlePlayPause = () => {
    loadAudio();

    const player = playerRef.current;
    if (!player) return;

    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      const player = playerRef.current as any;

      if (player?.__interval) {
        clearInterval(player.__interval);
      }

      playerRef.current = null;
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      <View style={styles.timeContainer}>
        <Text style={styles.currentTime}>
          {formatTime(positionSec)}
        </Text>

        <Text style={styles.totalTime}>
          / {call_duration_hms.slice(3)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 8,
    borderRadius: 10,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    marginLeft: 12,
    alignItems: "center",
  },
  currentTime: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  totalTime: {
    color: "#aaa",
    fontSize: 13,
    marginLeft: 4,
  },
});