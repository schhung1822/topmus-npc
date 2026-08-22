import Image from "next/image";

type SharedTickerProps = {
  items: string[];
  variant: "pink" | "dark";
  ariaLabel: string;
};

function TickerGroup({ items, variant }: Pick<SharedTickerProps, "items" | "variant">) {
  const isDark = variant === "dark";

  return (
    <div className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <div
          className={
            isDark
              ? "flex shrink-0 items-center gap-4 pl-5 text-[17px] leading-none font-bold whitespace-nowrap text-white sm:gap-6 sm:pl-7 sm:text-[21px]"
              : "flex shrink-0 items-center gap-3.5 pl-[18px] text-base leading-none font-bold whitespace-nowrap text-white sm:gap-5 sm:pl-6 sm:text-[19px]"
          }
          key={`${index}-${item}`}
        >
          <span>{item}</span>
          <Image
            className={isDark ? "size-6 object-contain sm:size-8" : "size-6 object-contain sm:size-7"}
            src="/img/icon-start.webp"
            alt=""
            width={36}
            height={36}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

export function SharedTicker({ items, variant, ariaLabel }: SharedTickerProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={
        isDark
          ? "relative min-h-[62px] w-full overflow-hidden bg-[#310045] shadow-[inset_0_1px_rgba(255,255,255,0.09)] sm:min-h-[76px]"
          : "relative min-h-[54px] w-full overflow-hidden bg-[linear-gradient(90deg,#f53ee8_0%,#ec40df_44%,#f948ed_100%)] shadow-[inset_0_1px_rgba(255,255,255,0.28)] sm:min-h-[62px]"
      }
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className={
          isDark
            ? "flex min-h-[62px] w-max animate-ticker items-center will-change-transform motion-reduce:animate-none sm:min-h-[76px]"
            : "flex min-h-[54px] w-max animate-ticker items-center will-change-transform motion-reduce:animate-none sm:min-h-[62px]"
        }
        aria-hidden="true"
      >
        <TickerGroup items={items} variant={variant} />
        <TickerGroup items={items} variant={variant} />
      </div>
    </div>
  );
}
