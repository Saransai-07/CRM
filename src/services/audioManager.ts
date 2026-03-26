import { createAudioPlayer, AudioPlayer } from "expo-audio";

class AudioManager {
  private static instance: AudioManager;
  private currentPlayer: AudioPlayer | null = null;
  private currentUri: string | null = null;

  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async play(uri: string, onStatusUpdate?: (status: any) => void) {
    // If same audio → just resume
    if (this.currentPlayer && this.currentUri === uri) {
      await this.currentPlayer.play();
      return this.currentPlayer;
    }

    // Stop previous audio (IMPORTANT)
    if (this.currentPlayer) {
      await this.currentPlayer.pause();
      await this.currentPlayer.remove();
      this.currentPlayer = null;
      this.currentUri = null;
    }

    // Create new player
    const player = createAudioPlayer({ uri });

    player.addListener("playbackStatusUpdate", (status) => {
      onStatusUpdate?.(status);
    });

    await player.play();

    this.currentPlayer = player;
    this.currentUri = uri;

    return player;
  }

  async pause() {
    if (this.currentPlayer) {
      await this.currentPlayer.pause();
    }
  }

  getCurrentUri() {
    return this.currentUri;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  async stop() {
    if (this.currentPlayer) {
      await this.currentPlayer.pause();
      await this.currentPlayer.remove();
      this.currentPlayer = null;
      this.currentUri = null;
    }
  }
}

export const audioManager = AudioManager.getInstance();