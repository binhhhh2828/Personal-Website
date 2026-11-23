export function SkipLink({ label = "Skip to content" }: { label?: string }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
    >
      {label}
    </a>
  );
}
