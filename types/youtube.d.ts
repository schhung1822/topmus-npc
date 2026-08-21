type YouTubePlayerEvent = {
  target: YouTubePlayer;
  data: number;
};

type YouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
};

interface Window {
  YT?: {
    Player: new (
      element: HTMLElement,
      options: {
        width: string;
        height: string;
        videoId: string;
        playerVars: Record<string, string | number>;
        events: {
          onReady(event: YouTubePlayerEvent): void;
          onStateChange(event: YouTubePlayerEvent): void;
        };
      },
    ) => YouTubePlayer;
    PlayerState: {
      ENDED: number;
      PLAYING: number;
      PAUSED: number;
    };
  };
  onYouTubeIframeAPIReady?: () => void;
}
