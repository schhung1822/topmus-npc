import Image from "next/image";
import {
  ChevronRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const policies = [
  {
    label: "Tìm hiểu thêm về Topmus",
    href: "https://topmus.vn/",
  },
  {
    label: "Chính sách bảo mật thông tin",
    href: "https://topmus.vn/chinh-sach-bao-mat-thong-tin/",
  },
  {
    label: "Chính sách dành cho nhà tài trợ & đối tác",
    href: "https://topmus.vn/chinh-sach-danh-cho-nha-tai-tro-doi-tac/",
  },
  {
    label: "Chính sách dành cho IDOL",
    href: "https://topmus.vn/chinh-sach-danh-cho-idol/",
  },
];

const socialChannels: Array<{
  label: string;
  href: string;
  iconSrc: string;
}> = [
  { label: "Facebook", href: "https://www.facebook.com/topmuslive", iconSrc: "/icon/facebook.svg" },
  { label: "Instagra", href: "https://zalo.me/4225834416089737789", iconSrc: "/icon/zalo.svg" },
  { label: "TikTok", href: "https://www.tiktok.com/@topmusvn", iconSrc: "/icon/tiktok.svg" },
  { label: "YouTube", href: "https://www.youtube.com/@topmusentertainment", iconSrc: "/icon/youtube.svg" },
];

const socialButtonClasses =
  "group grid size-10 place-items-center rounded-full border border-white/70 bg-white/[0.04] text-white transition duration-200 hover:-translate-y-1 hover:border-[#ef61db] hover:bg-[#a128aa] hover:shadow-[0_10px_24px_rgba(199,48,191,0.28)] sm:size-11";

const sectionTitleClasses =
  "text-[12px] font-extrabold tracking-[0.055em] text-white uppercase sm:text-[13px]";

export function SiteFooter() {
  return (
    <footer
      className="relative isolate overflow-hidden bg-[#0d0015] text-white"
      id="footer"
    >
      <div className="pointer-events-none absolute -top-44 -left-44 -z-10 size-[400px] rounded-full bg-[#8b219c]/15 blur-[110px]" />
      <div className="pointer-events-none absolute right-[-160px] bottom-[-210px] -z-10 size-[460px] rounded-full bg-[#c52ab7]/12 blur-[120px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#d948ce_48%,#8b2bb3_68%,transparent)] opacity-70" />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-11 px-4 pt-14 pb-12 sm:px-6 md:grid-cols-2 md:gap-x-12 lg:grid-cols-[1fr_1.35fr_0.65fr] lg:gap-[clamp(48px,6vw,88px)] lg:pt-[68px] lg:pb-[58px]">
        <div>
          <a
            className="inline-flex w-[184px] transition-opacity hover:opacity-85"
            href="#trang-chu"
            aria-label="TOPMUS - Trang chủ"
          >
            <Image
              className="h-auto w-full object-contain [filter:brightness(0)_invert(1)]"
              src="/img/logo_topmus.webp"
              alt="TOPMUS Entertainment"
              width={500}
              height={220}
            />
          </a>

          <section className="mt-10 lg:mt-12" aria-labelledby="footer-contact-title">
            <h2 className={sectionTitleClasses} id="footer-contact-title">
              Thông tin liên hệ
            </h2>

            <div className="mt-6 grid max-w-[370px] gap-4 text-xs leading-[1.65] text-white/58">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#df65d5]" strokeWidth={1.8} />
                <address className="not-italic">
                  <strong className="mb-1 block font-bold text-white/82">
                    Công Ty TNHH Nghệ Thuật &amp; Giải Trí TOPMUS
                  </strong>
                  Manhattan Glory, 53 Đ. T2, Vinhomes Grand Park, Thủ Đức,
                  Thành phố Hồ Chí Minh 70000, Việt Nam
                </address>
              </div>

              <a
                className="group flex items-center gap-3 text-white/58 no-underline transition hover:text-white"
                href="tel:0396800005"
              >
                <Phone className="size-4 shrink-0 text-[#df65d5]" strokeWidth={1.8} />
                0396.800.005
              </a>

              <a
                className="group flex items-center gap-3 text-white/58 no-underline transition hover:text-white"
                href="mailto:contact@topmus.vn"
              >
                <Mail className="size-4 shrink-0 text-[#df65d5]" strokeWidth={1.8} />
                contact@topmus.vn
              </a>

              <a
                className="group flex items-center gap-3 text-white/58 no-underline transition hover:text-white"
                href="https://topmus.vn"
              >
                <Globe2 className="size-4 shrink-0 text-[#df65d5]" strokeWidth={1.8} />
                topmus.vn
              </a>
            </div>
          </section>
        </div>

        <div>
          <div className="flex min-h-[76px] items-center lg:min-h-[84px]">
            <p className="max-w-[510px] text-[13px] leading-[1.7] text-white/72 sm:text-sm">
              Công Ty TOPMUS là đối tác chiến lược của TikTok Live Vietnam. Với 7 năm
              kinh nghiệm trong việc cung ứng và đào tạo nhà sáng tạo nội dung cho
              các App giải trí hàng đầu Việt Nam.
            </p>
          </div>

          <section className="mt-10 lg:mt-12" aria-labelledby="footer-policy-title">
            <h2 className={sectionTitleClasses} id="footer-policy-title">
              TOPMUS ENTERTAIMENT
            </h2>

            <ul className="mt-5 grid max-w-[420px] list-none gap-1 p-0">
              {policies.map((policy) => (
                <li key={policy.href}>
                  <a
                    className="group -ml-2 flex min-h-9 items-center gap-2 rounded-lg px-2 text-xs leading-5 text-white/58 no-underline transition hover:bg-white/[0.05] hover:text-white"
                    href={policy.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ChevronRight
                      className="size-3.5 shrink-0 text-[#d65dcc] transition group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                    <span>{policy.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col items-center border-t border-white/10 pt-8 md:col-span-2 md:flex-row md:items-center md:justify-between lg:col-span-1 lg:flex-col lg:items-start lg:justify-start lg:border-0 lg:pt-0">
          <div className="flex min-h-[76px] items-center lg:min-h-[84px]">
            <div className="flex items-center gap-2.5" aria-label="Mạng xã hội TOPMUS">
              {socialChannels.map((channel) => {
                return channel.href ? (
                  <a
                    className={socialButtonClasses}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Mở ${channel.label} của TOPMUS`}
                    key={channel.label}
                  >
                    <Image
                      className="size-[18px] object-contain [filter:brightness(0)_invert(1)] transition-transform group-hover:scale-110"
                      src={channel.iconSrc}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </a>
                ) : (
                  <span
                    className={`${socialButtonClasses} cursor-default`}
                    role="link"
                    aria-disabled="true"
                    aria-label={`${channel.label} - liên kết sẽ được cập nhật`}
                    title={`${channel.label} - liên kết sẽ được cập nhật`}
                    key={channel.label}
                  >
                    <Image
                      className="size-[18px] object-contain [filter:brightness(0)_invert(1)]"
                      src={channel.iconSrc}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-2 sm:mt-8 shrink-0 md:mt-0 md:ml-8 lg:mt-12 lg:ml-0">
            <div className="size-[166px] overflow-hidden rounded-[16px] border border-white/12 bg-white p-2 shadow-[0_18px_42px_rgba(0,0,0,0.28)] lg:size-[181px]">
              <Image
                className="size-full object-contain"
                src="/img/qrcode.webp"
                alt="Mã QR Zalo TOPMUS"
                width={200}
                height={200}
              />
            </div>
            <p className="mt-3 text-center text-[10px] font-semibold tracking-[0.08em] text-white/42 uppercase">
              Quét mã để kết nối
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07] bg-black/30">
        <div className="mx-auto flex min-h-[48px] w-full max-w-[1280px] flex-col items-center justify-center gap-1 px-4 py-3 text-center text-[12px] text-white/38 sm:flex-row sm:gap-2 sm:px-6">
          <p>© {new Date().getFullYear()} Bản quyền thuộc về &amp; Cung cấp bởi <a className="text-white/38 hover:text-white" href="https://nextgency.vn/" target="_blank">NEXTGENCY</a></p>
        </div>
      </div>
    </footer>
  );
}
