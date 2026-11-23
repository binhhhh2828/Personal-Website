"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import type { NavItem } from "@/config/navigation";
import { cx } from "@/lib/format";

function isActive(pathname: string, href: string) {
  if (href.startsWith("http")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavAnchor({
  item,
  className,
  onNavigate,
  children,
  active,
}: {
  item: NavItem;
  className: string;
  onNavigate?: () => void;
  children: ReactNode;
  active: boolean;
}) {
  // Cross-site links change host or root layout — a full navigation is correct.
  return item.crossSite ? (
    <a href={item.href} className={className} onClick={onNavigate}>
      {children}
    </a>
  ) : (
    <Link href={item.href} className={className} aria-current={active ? "page" : undefined} onClick={onNavigate}>
      {children}
    </Link>
  );
}

/**
 * Navigation links for the global bar (dark, translucent) or the local bar (light).
 * Inline from 834px; below that, a disclosure menu (spec: collapse when links don't fit).
 */
export function NavLinks({
  items,
  menuLabel,
  closeLabel,
  variant,
  extra,
}: {
  items: NavItem[];
  menuLabel: string;
  closeLabel: string;
  variant: "global" | "local";
  /** Always-visible control after the links (e.g. language switcher). */
  extra?: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = () => setOpen(false);
  const dark = variant === "global";

  const inlineCls = (active: boolean) =>
    cx(
      "t-body-sm transition-colors",
      dark
        ? active
          ? "text-white"
          : "text-white/80 hover:text-white"
        : active
          ? "text-ink"
          : "text-body/80 hover:text-link",
    );
  const menuCls = (active: boolean) =>
    cx(
      "flex min-h-12 items-center font-display text-[24px] font-semibold tracking-[0.009em] transition-colors",
      dark
        ? active
          ? "text-white"
          : "text-white/80 hover:text-white"
        : active
          ? "text-ink"
          : "text-body hover:text-link",
    );

  return (
    <>
      <div className="hidden items-center gap-6 min-[834px]:flex">
        <ul className={cx("flex items-center", dark ? "gap-7" : "gap-6")}>
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <NavAnchor item={item} active={active} className={inlineCls(active)}>
                  {item.label}
                </NavAnchor>
              </li>
            );
          })}
        </ul>
        {extra}
      </div>

      <div className="flex items-center gap-3 min-[834px]:hidden">
        {extra}
        <button
          type="button"
          className={cx("t-body-sm -mr-2 flex h-11 items-center gap-1.5 px-2", dark ? "text-white/90" : "text-ink")}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? closeLabel : menuLabel}
          <svg
            aria-hidden
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className={cx("transition-transform", open && "rotate-180")}
          >
            <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className={cx(
          "absolute inset-x-0 top-full z-30 min-[834px]:hidden",
          dark ? "bg-[#1d1d1f]" : "border-b border-hairline bg-canvas",
        )}
      >
        <ul className="px-4 pt-2 pb-6">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <NavAnchor item={item} active={active} onNavigate={close} className={menuCls(active)}>
                  {item.label}
                </NavAnchor>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
