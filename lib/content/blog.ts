export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "10 Essential AC Maintenance Tips Before Summer",
    excerpt:
      "Keep your air conditioner running efficiently with these preventive maintenance steps.",
    author: "Sahidul Islam",
    date: "Aug 02, 2026",
    category: "Appliance Care",
    readTime: "6 min read",
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
    content: [
      "Electrical safety starts with awareness. Regularly check switches, sockets, extension power points, and visible wiring for signs of heat or damage.",
      "Keep appliances away from moisture, avoid overloading sockets, and use the correct voltage and circuit protection for high-power equipment.",
      "When a system trips repeatedly or a power outlet smells hot, do not keep using the circuit. A licensed specialist can inspect the fault and help restore safe operation.",
    ],
  },
];

export function getBlogPost(id: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.id === id);
}
