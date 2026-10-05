export type LegalSection = { title: string; html: string };

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LegalSections({
  intro,
  sections,
  numbered = false,
}: {
  intro?: string;
  sections: LegalSection[];
  numbered?: boolean;
}) {
  return (
    <div className="container-editorial py-12 md:py-20 max-w-3xl">
      {intro && (
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
          {intro}
        </p>
      )}
      <div className="space-y-3">
        {sections.map((s, index) => {
          const id = slugify(s.title);
          return (
            <article
              key={s.title}
              id={id}
              className="border hairline p-5 md:p-6 bg-paper scroll-mt-24"
            >
              <h2 className="text-sm font-bold mb-3 tracking-tight flex items-baseline gap-3">
                {numbered && (
                  <span className="font-serif text-muted-foreground font-normal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span>{s.title}</span>
              </h2>
              <div
                className="text-sm text-ink/75 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-forest [&_p]:leading-relaxed"
                // Content is developer-authored constant text, not user input.
                dangerouslySetInnerHTML={{ __html: s.html }}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
