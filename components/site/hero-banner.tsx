import Image from "next/image";
import type { HeroBannerContent } from "@/lib/hero-banner-content";

export function HeroBanner({ content }: { content: HeroBannerContent }) {
  return (
    <section
      className="relative aspect-[19/9] w-full overflow-hidden bg-[#26003f]"
      id="trang-chu"
      aria-label="Banner TOPMUS Entertainment"
    >
      <Image
        className="object-contain"
        src={content.image}
        alt={content.alt}
        fill
        sizes="100vw"
        priority
      />
    </section>
  );
}
