export function prepareInlineVideo(video: HTMLVideoElement) {
  video.defaultMuted = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "true");
}

export function isZaloAppleMobileWebView(userAgent = navigator.userAgent) {
  return /zalo/i.test(userAgent) && /iPad|iPhone|iPod/i.test(userAgent);
}

export function allowsAutomaticInlinePlayback() {
  const userAgent = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/i.test(userAgent);
  const isZaloOnAppleMobile = isZaloAppleMobileWebView(userAgent);
  const isIosWebView = isAppleMobile && /AppleWebKit/i.test(userAgent) && !/Safari/i.test(userAgent);
  const reportsInlinePlayback = window.matchMedia("(-webkit-video-playable-inline)").matches;

  return !isZaloOnAppleMobile && !isIosWebView && (!isAppleMobile || reportsInlinePlayback);
}
