"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type SVGProps,
} from "react";
import { useRouter } from "next/navigation";

/* ------------------------------ Icons ------------------------------ */

type IconProps = SVGProps<SVGSVGElement>;

function make(children: ReactNode) {
  return function Icon({ className = "h-5 w-5", ...rest }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...rest}
      >
        {children}
      </svg>
    );
  };
}

export const IconSearch = make(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>
);
export const IconCart = make(
  <>
    <circle cx="9" cy="20" r="1.6" />
    <circle cx="17.5" cy="20" r="1.6" />
    <path d="M2.5 3.5h2l2.6 12h10.9l2.5-8.5H6" />
  </>
);
export const IconPlus = make(<path d="M12 5v14M5 12h14" />);
export const IconMinus = make(<path d="M5 12h14" />);
export const IconTrash = make(
  <>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15" />
    <path d="M10 11v6M14 11v6" />
  </>
);
export const IconX = make(<path d="M18 6 6 18M6 6l12 12" />);
export const IconCheck = make(<path d="M20 6 9 17l-5-5" />);
export const IconTruck = make(
  <>
    <path d="M1.5 5.5h13v11h-13z" />
    <path d="M14.5 9.5h4l3 3.5v3.5h-7" />
    <circle cx="6" cy="18" r="1.8" />
    <circle cx="17.5" cy="18" r="1.8" />
  </>
);
export const IconCash = make(
  <>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M5.5 9.5h.01M18.5 14.5h.01" />
  </>
);
export const IconShield = make(
  <>
    <path d="M12 2.5 4.5 5.5v6c0 4.8 3.2 8 7.5 10 4.3-2 7.5-5.2 7.5-10v-6L12 2.5Z" />
    <path d="m8.8 11.8 2.3 2.3 4.2-4.2" />
  </>
);
export const IconHeadset = make(
  <>
    <path d="M4 13a8 8 0 1 1 16 0" />
    <rect x="2.8" y="13" width="4" height="6.5" rx="1.8" />
    <rect x="17.2" y="13" width="4" height="6.5" rx="1.8" />
  </>
);
export const IconBox = make(
  <>
    <path d="m12 2.5 8.5 4.5v10L12 21.5 3.5 17V7L12 2.5Z" />
    <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" />
  </>
);
export const IconGrid = make(
  <>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </>
);
export const IconTag = make(
  <>
    <path d="m3 11 9.3 9.3a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8L11 3H4a1 1 0 0 0-1 1v7Z" />
    <circle cx="7.5" cy="7.5" r="1.3" />
  </>
);
export const IconGear = make(
  <>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
  </>
);
export const IconLogout = make(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </>
);
export const IconChevron = make(<path d="m6 9 6 6 6-6" />);
export const IconEdit = make(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
  </>
);
export const IconLock = make(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>
);
export const IconPhone = make(
  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7a2 2 0 0 1 1.7 2.03Z" />
);
export const IconChat = make(
  <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
);
export const IconStore = make(
  <>
    <path d="M3.5 9 5 3h14l1.5 6" />
    <path d="M3.5 9a2.6 2.6 0 0 0 5.2 0 2.6 2.6 0 0 0 5.2 0 2.6 2.6 0 0 0 5.2 0" />
    <path d="M4.5 11.5V21h15v-9.5M9.5 21v-6h5v6" />
  </>
);
export const IconFlame = make(
  <path d="M12 2.5c1 3-0.5 4.5-2 6-1.7 1.7-3 3.6-3 6a7 7 0 0 0 14 0c0-5-4-6.5-4-10-2 1-2.7 2.5-2.5 4.5-1.5-.8-2.5-3.5-2.5-6.5Z" />
);
export const IconArrowLeft = make(<path d="M19 12H5m6-7-7 7 7 7" />);
export const IconSpark = ({
  className = "h-4 w-4",
  ...rest
}: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
    <path d="M12 1.5c.9 5 2.6 6.7 7.5 7.5v6c-4.9.8-6.6 2.5-7.5 7.5-.9-5-2.6-6.7-7.5-7.5v-6c4.9-.8 6.6-2.5 7.5-7.5Z" />
  </svg>
);
export const IconStar = ({
  className = "h-4 w-4",
  ...rest
}: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...rest}>
    <path d="m12 2.7 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5L2.6 9.5l6.5-.9L12 2.7Z" />
  </svg>
);

/* ------------------------------ Reveal ------------------------------ */

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${inView ? "in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* --------------------------- Secret access --------------------------- */

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`font-display text-[26px] leading-none tracking-wide ${
        dark ? "text-paper" : "text-ink"
      }`}
    >
      MEHDI<span className="text-saffron-500">SHOP</span>
    </span>
  );
}

export function SecretLogo({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const [clicks, setClicks] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    const next = clicks + 1;
    if (timer.current) clearTimeout(timer.current);
    if (next >= 5) {
      setClicks(0);
      // نفتح اللوحة في نفس الصفحة (يعمل داخل Google Sites بدون تغيير الرابط).
      // إن لم تكن الطبقة موجودة في هذه الصفحة ننتقل إلى /admin كخطة بديلة.
      let handled = false;
      if (typeof window !== "undefined") {
        const ev = new CustomEvent("mehdishop:open-admin", {
          cancelable: true,
        });
        window.dispatchEvent(ev);
        handled = ev.defaultPrevented;
      }
      if (!handled) router.push("/admin");
      return;
    }
    setClicks(next);
    timer.current = setTimeout(() => setClicks(0), 2500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchEnd={(e) => {
        // دعم اللمس داخل Google Sites على الهاتف
        e.preventDefault();
        handleClick();
      }}
      className="btn-press relative cursor-pointer select-none outline-none"
      aria-label="MEHDISHOP"
      title="MEHDISHOP"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Wordmark dark={dark} />
      {/* مؤشر خفي للنقرات — يظهر من الثالثة فقط */}
      {clicks >= 3 && (
        <span className="pointer-events-none absolute -bottom-1 left-0 right-0 flex justify-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1 w-1 rounded-full transition ${
                i < clicks
                  ? "bg-saffron-500"
                  : dark
                    ? "bg-paper/25"
                    : "bg-ink/20"
              }`}
            />
          ))}
        </span>
      )}
    </button>
  );
}

/* --------------------------- Small pieces --------------------------- */

export function QtyStepper({
  qty,
  onChange,
  max = 99,
  small = false,
}: {
  qty: number;
  onChange: (q: number) => void;
  max?: number;
  small?: boolean;
}) {
  const btn = `grid place-items-center rounded-md bg-ink/5 text-ink transition hover:bg-ink/10 active:scale-90 disabled:opacity-30 ${
    small ? "h-6.5 w-6.5" : "h-8 w-8"
  }`;
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-ink/10 bg-white p-1">
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(qty + 1, max))}
        aria-label="زيادة"
      >
        <IconPlus className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <span
        className={`${
          small ? "w-6 text-xs" : "w-8 text-sm"
        } text-center font-extrabold tabular-nums`}
      >
        {qty}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(qty - 1)}
        disabled={qty <= 1}
        aria-label="إنقاص"
      >
        <IconMinus className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}
