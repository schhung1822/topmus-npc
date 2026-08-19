import Script from "next/script";

export function GoogleAnalytics({ analyticsId }: { analyticsId: string }) {
  if (!analyticsId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', ${JSON.stringify(analyticsId)}, { send_page_view: true });`}
      </Script>
    </>
  );
}
