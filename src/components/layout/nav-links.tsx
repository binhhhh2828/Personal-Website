"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import type { NavItem } from "@/config/navigation";
import { cx } from "@/lib/format";

function isActive(pathname: string, href: string) {
  if (href.startsWith("http")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Item({
  item,
  pathname,
  className,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item.href);
  const cls = cx(
    "transition-colors hover:text-fg",
    active ? "text-fg" : "text-muted",
    className,
  );
  const label = (
    <>
      {item.label}
      {item.crossSite && (
        <span aria-hidden className="ml-0.5 text-subtle">
          ↗
        </span>
      )}
    </>
  );
  // Cross-site links change host or root layout — a full navigation is correct.
  return item.crossSite ? (
    <a href={item.href} className={cls} onClick={onNavigate}>
      {label}
    </a>
  ) : (
    <Link
      href={item.href}
      className={cls}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {label}
    </Link>
  );
}

/** Desktop inline nav + mobile disclosure menu. */
export function NavLinks({
  items,
  menuLabel,
  closeLabel,
}: {
  items: NavItem[];
  menuLabel: string;
  closeLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <ul className="hidden items-center gap-7 text-sm md:flex">
        {items.map((item) => (
          <li key={item.href}>
            <Item item={item} pathname={pathname} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="-mr-2 p-2 font-mono text-xs tracking-wider uppercase md:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? closeLabel : menuLabel}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-rule bg-bg shadow-[0_12px_24px_-16px_rgb(25_25_25_/0.25)] md:hidden"
      >
        <ul className="mx-auto max-w-(--container-page) px-4 py-2 sm:px-6">
          {items.map((item) => (
            <li key={item.href} className="border-b border-rule last:border-0">
              <Item
                item={item}
                pathname={pathname}
                className="block py-3.5 text-base"
                onNavigate={() => setOpen(false)}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
