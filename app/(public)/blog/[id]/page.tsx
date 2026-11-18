import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS, getBlogPost } from "@/lib/content/blog";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ id: post.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const post = getBlogPost((await params).id);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const post = getBlogPost((await params).id);
  if (!post) notFound();

  return (
    <main className="flex-1">
      <article>
        <header className="ruled border-b">
          <div className="mx-auto max-w-3xl px-4 pt-10 pb-12 sm:px-6 md:pt-14">
            <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /> Journal
            </Link>
            <p className="eyebrow mt-10 animate-rise !text-primary">
              {post.category} · {post.readTime}
            </p>
            <h1 className="mt-4 animate-rise text-4xl leading-[1.08] font-semibold text-balance [animation-delay:80ms] md:text-6xl">
              {post.title}
            </h1>
            <p className="mt-6 animate-rise font-mono text-sm text-muted-foreground [animation-delay:160ms]">
              By {post.author} · {post.date}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="font-display text-2xl leading-snug">{post.excerpt}</p>
          <div className="mt-8 space-y-6 text-[1.05rem] leading-8 text-muted-foreground">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="mt-14 flex flex-col items-start gap-4 rounded-xl bg-deep p-8 text-deep-foreground sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold">Rather have someone else do it?</p>
              <p className="mt-1 text-deep-foreground/70">Book a verified technician — you pay only after they accept.</p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <Link href="/services">
                Find a technician <ArrowRight />
              </Link>
            </Button>
          </aside>
        </div>
      </article>
    </main>
  );
}
