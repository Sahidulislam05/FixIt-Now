import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { ServiceCover } from "@/components/shared/service-card";
import { BLOG_POSTS } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Journal",
  description: "Practical maintenance guides and home care advice from FixItNow technicians.",
};

export default function BlogPage() {
  const [lead, ...rest] = BLOG_POSTS;

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Journal"
        title={<>Notes from <em className="text-primary">the toolbox.</em></>}
        description="Short, practical guides on keeping a home in working order — and knowing when to call someone."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <Reveal>
          <Link
            href={`/blog/${lead.id}`}
            className="group grid overflow-hidden rounded-xl border bg-card md:grid-cols-2"
          >
            <ServiceCover category={lead.category} className="h-56 md:h-full" />
            <div className="flex flex-col gap-4 p-8 md:p-10">
              <p className="eyebrow !text-primary">
                {lead.category} · {lead.readTime}
              </p>
              <h2 className="text-3xl font-semibold group-hover:underline md:text-4xl">{lead.title}</h2>
              <p className="text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-auto flex items-center justify-between pt-6 font-mono text-xs text-muted-foreground">
                {lead.author} · {lead.date}
                <ArrowUpRight className="size-5 text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </p>
            </div>
          </Link>
        </Reveal>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <Link href={`/blog/${post.id}`} className="group lift flex h-full flex-col rounded-xl border bg-card p-8">
                <p className="eyebrow !text-primary">
                  {post.category} · {post.readTime}
                </p>
                <h2 className="mt-3 text-2xl font-semibold group-hover:underline">{post.title}</h2>
                <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                <p className="mt-auto flex items-center justify-between pt-8 font-mono text-xs text-muted-foreground">
                  {post.author} · {post.date}
                  <ArrowUpRight className="size-5 text-foreground" />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
