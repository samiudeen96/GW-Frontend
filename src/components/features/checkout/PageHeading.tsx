/** Island twin of `common/PageHeader.astro` for headings that depend on cart state. */
export function PageHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <header className="container-editorial border-b hairline pt-16 pb-10 md:pt-24 md:pb-16">
      {eyebrow && <p className="mb-4 text-sm text-forest/60">{eyebrow}</p>}
      <h1 className="max-w-4xl display-lg">{title}</h1>
    </header>
  );
}

/** Pulse placeholder shown until the cart has loaded from storage. */
export function LoadingBlock({ label }: { label?: string }) {
  return (
    <div className="border hairline bg-paper p-8 md:p-12" aria-busy="true">
      {label && (
        <div className="mb-4 font-mono text-[10px] tracking-[0.28em] text-forest/60 uppercase">
          {label}
        </div>
      )}
      <div className="space-y-3">
        <div className="h-3 w-3/4 animate-pulse bg-forest/10" />
        <div className="h-3 w-1/2 animate-pulse bg-forest/10" />
        <div className="h-3 w-2/3 animate-pulse bg-forest/10" />
      </div>
    </div>
  );
}
