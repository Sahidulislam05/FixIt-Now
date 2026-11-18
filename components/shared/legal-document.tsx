import { PageHeader } from "@/components/shared/page-header";

interface LegalDocumentProps {
  title: string;
  updated: string;
  sections: { title: string; body: string }[];
}

/** Shared layout for Terms and Privacy: header, sticky contents list, numbered sections. */
export function LegalDocument({ title, updated, sections }: LegalDocumentProps) {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <main className="flex-1">
      <PageHeader eyebrow={`Last updated · ${updated}`} title={title} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ol className="sticky top-24 space-y-2 border-l pl-4 text-sm">
            {sections.map((s) => (
              <li key={s.title}>
                <a href={`#${slug(s.title)}`} className="text-muted-foreground transition-colors hover:text-foreground">
                  {s.title.replace(/^\d+\.\s*/, "")}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="max-w-2xl space-y-10">
          {sections.map((s) => (
            <section key={s.title} id={slug(s.title)} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
