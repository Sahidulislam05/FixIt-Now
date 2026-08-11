import Link from "next/link";
import { Calendar, User } from "lucide-react";

export const metadata = {
  title: "Blog & Insights | FixitNow",
  description:
    "Expert tips, maintenance guides, and home care advice from FixitNow.",
};

const BLOG_POSTS = [
  {
    id: "1",
    title: "10 Essential AC Maintenance Tips Before Summer",
    excerpt:
      "Keep your air conditioner running efficiently with these preventive maintenance steps.",
    author: "Sahidul Islam",
    date: "Aug 02, 2026",
    category: "Appliance Care",
  },
  {
    id: "2",
    title: "How to Identify and Fix Common Plumbing Leaks",
    excerpt:
      "Discover how early leak detection can save you thousands in water damage repairs.",
    author: "Tanvir Hossain",
    date: "Jul 28, 2026",
    category: "Plumbing",
  },
  {
    id: "3",
    title: "Electrical Safety Checklist for Modern Homes",
    excerpt:
      "Ensure your home wiring and appliances meet standard safety guidelines.",
    author: "Ayesha Rahman",
    date: "Jul 15, 2026",
    category: "Electrical",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          FixitNow Knowledge Base
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Articles, guides, and technical advice to keep your home running
          smoothly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="flex flex-col justify-between border rounded-2xl bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                {post.category}
              </span>
              <h2 className="text-xl font-bold line-clamp-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/blog/${post.id}`}
                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
              >
                Read article
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
