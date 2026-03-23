import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAudioPlayer } from "expo-audio";

export const AudioBar = ({ uri, startTime, endTime }: any) => {
  const player = useAudioPlayer(uri);
  const playerRef = useRef(player);

  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    playerRef.current = player;

    const sub = player.addListener("playbackStatusUpdate", (s) => {
      setStatus(s);
      setIsPlaying(s.playing);
    });

    return () => {
      try {
        sub.remove();

        // ✅ SAFE cleanup
        if (playerRef.current) {
          playerRef.current.pause?.();
        }
      } catch (e) {
        // ignore crash safely
      }
    };
  }, [player]);

  const togglePlay = async () => {
    try {
      if (!playerRef.current) return;

      if (isPlaying) {
        await playerRef.current.pause?.();
      } else {
        await playerRef.current.play?.();
      }
    } catch (e) {
      console.log("Audio error:", e);
    }
  };

  // 🔹 Convert API times → duration (ms)
  const getDuration = () => {
    if (!startTime || !endTime) return 0;

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    return end - start; // in ms
  };

  const duration = getDuration();

  // 🔹 REAL progress (based on playback)
  const progress =
    status?.positionMillis && duration
      ? status.positionMillis / duration
      : 0;

  const formatTime = (millis: number = 0) => {
    const totalSeconds = Math.floor(millis / 1000);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const formatClock = (date?: string) => {
    if (!date) return "--:--";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const WAVE_COUNT = 20;

  const renderWaves = () => {
    return Array.from({ length: WAVE_COUNT }).map((_, i) => {
      const active = progress * WAVE_COUNT > i;

      return (
        <View
          key={i}
          style={[
            styles.wave,
            {
              height: Math.random() * 12 + 6,
              backgroundColor: active ? "#0A84FF" : "#555",
            },
          ]}
        />
      );
    });
  };

  // const progress = formatClock(endTime) ? Number(formatClock(startTime)) / Number(formatClock(endTime)) : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
        <Text style={styles.playIcon}>{isPlaying ? "⏸️" : "▶️"}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          {/* <Text style={styles.edgeTime}>{formatClock(startTime)}</Text> */}

          <View style={styles.progressBg}>
            {/* <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            /> */}
          </View>

          {/* <Text style={styles.edgeTime}>{formatClock(endTime)}</Text> */}
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.time}>
            {formatTime(status?.positionMillis)}
          </Text>
          <Text style={styles.time}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0A84FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  playIcon: {
    color: "#fff",
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  edgeTime: {
    color: "#aaa",
    fontSize: 10,
    width: 55,
  },

  progressBg: {
    flex: 1,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    marginHorizontal: 6,
  },

  progressFill: {
    height: 4,
    backgroundColor: "#0A84FF",
    borderRadius: 2,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  time: {
    color: "#aaa",
    fontSize: 10,
  },

  waveContainer: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginHorizontal: 6,
},

wave: {
  width: 3,
  borderRadius: 2,
},
});