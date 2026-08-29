export function prepareInlineVideo(video: HTMLVideoElement) {
  video.defaultMuted = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");
}

export function allowsAutomaticInlinePlayback() {
  const userAgent = navigator.userAgent;
  const isZaloWebView = /zalo/i.test(userAgent);
  const isAppleMobile = /iPad|iPhone|iPod/i.test(userAgent);
  const isIosWebView = isAppleMobile && /AppleWebKit/i.test(userAgent) && !/Safari/i.test(userAgent);
  const reportsInlinePlayback = window.matchMedia("(-webkit-video-playable-inline)").matches;

  return !isZaloWebView && !isIosWebView && (!isAppleMobile || reportsInlinePlayback);
}
