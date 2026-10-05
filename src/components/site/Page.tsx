import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="container-editorial pt-16 md:pt-24 pb-10 md:pb-16 border-b hairline">
      {eyebrow && <p className="text-sm text-forest/60 mb-4">{eyebrow}</p>}
      <h1 className="display-lg max-w-4xl">{title}</h1>
      {intro && (
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {intro}
        </p>
      )}
    </header>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="container-editorial py-12 md:py-20 max-w-3xl">
      <div className="space-y-6 text-[15px] leading-[1.75] text-ink/85 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-forest [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
        {children}
      </div>
    </div>
  );
}
