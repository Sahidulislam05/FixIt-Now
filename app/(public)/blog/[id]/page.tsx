import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

import { Button } from "@/components/ui/button";

const BLOG_POSTS = [
  {
    id: "1",
    title: "10 Essential AC Maintenance Tips Before Summer",
    excerpt:
      "Keep your air conditioner running efficiently with these preventive maintenance steps.",
    author: "Sahidul Islam",
    date: "Aug 02, 2026",
    category: "Appliance Care",
    readTime: "6 min read",
    cover: "Air conditioning service checklist",
    content: [
      "A well-maintained air conditioner can reduce energy use, improve cooling performance, and protect your home comfort during the hot months.",
      "Start with a quick inspection of the indoor and outdoor units. Make sure the air filters are clean, vents are clear, and drainage paths are not blocked.",
      "If your cooling system has been working harder than usual, a professional technician can check refrigerant pressure, fan performance, and electrical connections before a larger problem develops.",
    ],
  },
  {
    id: "2",
    title: "How to Identify and Fix Common Plumbing Leaks",
    excerpt:
      "Discover how early leak detection can save you thousands in water damage repairs.",
    author: "Tanvir Hossain",
    date: "Jul 28, 2026",
    category: "Plumbing",
    readTime: "5 min read",
    cover: "Leak detection and plumbing repair guide",
    content: [
      "A small plumbing leak can turn into a bigger maintenance issue when it stays hidden behind a wall, under a sink, or near an appliance connection.",
      "Look for damp signs, water stains, unusual sounds, or a sudden jump in your water bill. If you notice these signs, shut off the affected water line and inspect the connection points.",
      "For urgent or hard-to-reach leaks, book a verified technician through FixItNow. A professional can quickly diagnose the source and recommend the safest repair path.",
    ],
  },
  {
    id: "3",
    title: "Electrical Safety Checklist for Modern Homes",
    excerpt:
      "Ensure your home wiring and appliances meet standard safety guidelines.",
    author: "Ayesha Rahman",
    date: "Jul 15, 2026",
    category: "Electrical",
    readTime: "7 min read",
    cover: "Home electrical safety checklist",
    content: [
      "Electrical safety starts with awareness. Regularly check switches, sockets, extension power points, and visible wiring for signs of heat or damage.",
      "Keep appliances away from moisture, avoid overloading sockets, and use the correct voltage and circuit protection for high-power equipment.",
      "When a system trips repeatedly or a power outlet smells hot, do not keep using the circuit. A licensed specialist can inspect the fault and help restore safe operation.",
    ],
  },
];

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = BLOG_POSTS.find((item) => item.id === id) ?? BLOG_POSTS[0];

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="mt-8 rounded-3xl border bg-card shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/90 to-primary/70 px-8 py-12 text-primary-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                {post.category}
              </span>
              <span className="text-xs font-medium opacity-90">
                {post.readTime}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm opacity-90">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <h2 className="text-xl font-bold tracking-tight">{post.cover}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Smart home maintenance starts with awareness, prevention, and
                knowing when to bring in a specialist.
              </p>
            </div>

            <div className="prose prose-slate max-w-none space-y-6">
              {post.content.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className="text-[15px] leading-8 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-border/60 bg-muted/40 p-6">
              <h3 className="text-lg font-bold text-foreground">
                Need help with this service?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Book a trusted FixItNow specialist to inspect, advise, and
                complete the work safely.
              </p>
              <div className="mt-5">
                <Link href="/services">
                  <Button>Book a Service</Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
