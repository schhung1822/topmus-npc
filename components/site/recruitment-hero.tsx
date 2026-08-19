import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./recruitment-hero.module.css";

const benefits = [
  {
    icon: "/img/icon1.webp",
    alt: "Biểu tượng thu nhập",
    content: (
      <>
        Lương cứng ổn định + hoa hồng chia sẻ <strong>lên tới 70%</strong>
      </>
    ),
  },
  {
    icon: "/img/icon2.webp",
    alt: "Biểu tượng studio livestream",
    content: (
      <>
        Studio và hệ thống thiết bị live trị giá <strong>5.000 USD</strong>
      </>
    ),
  },
  {
    icon: "/img/icon3.webp",
    alt: "Biểu tượng mentor",
    content: (
      <>
        <strong>Mentor 1:1</strong> phân tích dữ liệu từng buổi live
      </>
    ),
  },
];

function TickerGroup({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <div
          className="flex shrink-0 items-center gap-3.5 pl-[18px] text-base leading-none font-extrabold whitespace-nowrap text-white sm:gap-5 sm:pl-6 sm:text-[19px]"
          key={`${index}-${item}`}
        >
          <span>{item}</span>
          <Image
            aria-hidden="true"
            alt=""
            className="size-6 object-contain sm:size-7"
            height={36}
            src="/img/icon-start.webp"
            width={36}
          />
        </div>
      ))}
    </div>
  );
}

export function RecruitmentHero({ tickerItems }: { tickerItems: string[] }) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(145,0,190,0.28),transparent_43%),linear-gradient(108deg,#260039_0%,#3a0058_45%,#59007a_100%)] text-white"
      aria-labelledby="recruitment-title" id="gioi-thieu"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[180px] -left-[110px] -z-10 size-[390px] rounded-full bg-[#9400d3]/20 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-120px] bottom-[35px] -z-10 size-[330px] rounded-full bg-[#e720ff]/15 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[180px] w-[min(760px,70vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a00be]/20 blur-[65px]"
      />

      <div className="mx-auto flex min-h-[434px] w-full max-w-[1280px] flex-col justify-center px-5 py-[60px] sm:py-[80px]">
        <div className="flex flex-col sm:flex-row items-center gap-7 justify-between">
          <div className="text-center md:text-left">
            <h1
              className="m-0 text-[27px] leading-[1.22] font-bold tracking-[-0.025em] text-[#ff1cf0] md:text-[clamp(30px,2.2vw,40px)]"
              id="recruitment-title"
            >
              <span className="block text-white">TOPMUS Entertainment</span>
              Tuyển gấp 2026
            </h1>
            <p className="mt-[22px] max-w-[520px] text-[16px] leading-[1.55] text-white/90 md:mt-[38px] md:max-w-[480px] md:leading-[1.42]">
              Nhập vai nhân vật, livestream trên TikTok và biến cá tính của bạn thành thu nhập
              thật. Không cần kinh nghiệm - TOPMUS đào tạo từ con số 0 với lộ trình 45 ngày thực
              chiến. Đợt này tuyển ứng viên nữ từ 18 tuổi, ngoại hình ưa nhìn.
            </p>
          </div>

          <ul className="m-0 grid list-none max-w-[640px] gap-[7px] p-0" aria-label="Quyền lợi khi ứng tuyển">
            {benefits.map((benefit) => (
              <li
                className={`${styles.benefitCard} flex min-h-16 items-center rounded-[14px] border border-[#de9bff]/30 bg-[linear-gradient(90deg,rgba(87,0,123,0.42),rgba(58,0,93,0.2))] px-3 py-2.5 text-[14px] leading-[1.35] font-bold text-white shadow-[inset_0_1px_rgba(255,255,255,0.05),0_9px_22px_rgba(17,0,28,0.1)] sm:items-center sm:rounded-2xl sm:px-[30px] sm:py-2 sm:text-[16px]`}
                key={benefit.icon}
              >
                <Image
                  alt={benefit.alt}
                  className={`${styles.benefitIcon} mt-px mr-2 size-[39px] shrink-0 object-contain drop-shadow-[0_4px_8px_rgba(28,0,44,0.18)] sm:mt-0 sm:mr-2.5 sm:size-[42px]`}
                  height={64}
                  src={benefit.icon}
                  width={64}
                />
                <span className="[&_strong]:font-bold [&_strong]:text-[#fa26df]">
                  {benefit.content}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 grid justify-items-center md:mt-[48px]">
          <a
            className="inline-flex min-h-[50px] min-w-[225px] items-center justify-center gap-[18px] rounded-full border border-white/55 bg-[linear-gradient(180deg,#ff55f1_0%,#f000db_58%,#dc00ce_100%)] py-[7px] pr-2.5 pl-7 text-[19px] font-black text-white no-underline shadow-[inset_0_3px_6px_rgba(255,255,255,0.45),0_0_22px_rgba(255,0,231,0.48)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_3px_6px_rgba(255,255,255,0.5),0_0_30px_rgba(255,0,231,0.65)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none sm:min-h-[53px] font-bold sm:min-w-[251px] sm:text-[20px]"
            href="#lien-he"
          >
            <span>Đăng ký ngay</span>
            <span
              className="grid size-[30px] shrink-0 place-items-center rounded-full bg-white text-[#f100dc]"
              aria-hidden="true"
            >
              <ArrowRight size={18} strokeWidth={3} />
            </span>
          </a>
          <p className="mt-4 max-w-[290px] text-center text-xs leading-[1.4] font-medium text-[#d75bd1] sm:max-w-none">
            Không thu phí ứng tuyển - thông tin được bảo mật
          </p>
        </div>
      </div>

      <div
        className="relative min-h-[54px] w-full overflow-hidden bg-[linear-gradient(90deg,#f53ee8_0%,#ec40df_44%,#f948ed_100%)] shadow-[inset_0_1px_rgba(255,255,255,0.28)] sm:min-h-[62px]"
        role="region"
        aria-label="Quyền lợi nổi bật của chương trình tuyển NPC Live"
      >
        <div
          className="flex min-h-[54px] w-max animate-ticker items-center will-change-transform motion-reduce:animate-none sm:min-h-[62px]"
          aria-hidden="true"
        >
          <TickerGroup items={tickerItems} />
          <TickerGroup items={tickerItems} />
        </div>
      </div>
    </section>
  );
}
