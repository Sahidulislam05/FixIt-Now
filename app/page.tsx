"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/queries/use-categories";
import { useServices } from "@/hooks/queries/use-services";
import { useTechnicians } from "@/hooks/queries/use-technicians";
import { getAvatarUrl, getCategoryIconUrl } from "@/lib/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

import {
  Search,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Wrench,
  FolderTree,
  Mail,
  Send,
  Loader2,
  Quote,
} from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rafiq Ahmed",
    role: "গ্রাহক, ধানমন্ডি",
    quote:
      "রাত ১১টায় হঠাৎ পানির লাইন লিক হয়ে গিয়েছিল। FixItNow-এ বুক করার ৩০ মিনিটের মধ্যেই টেকনিশিয়ান চলে এসেছিলেন। খরচও আগেই স্পষ্ট জানা ছিল।",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "গ্রাহক, উত্তরা",
    quote:
      "AC সার্ভিসিংয়ের জন্য বুক করেছিলাম। প্রোফাইলে রেটিং আর রিভিউ দেখে টেকনিশিয়ান বেছে নেওয়াটা সহজ হয়েছে, কাজও পরিপাটি হয়েছে।",
    rating: 5,
  },
  {
    name: "Kamal Hossain",
    role: "টেকনিশিয়ান, ইলেকট্রিশিয়ান",
    quote:
      "একজন ইলেকট্রিশিয়ান হিসেবে এই প্ল্যাটফর্মে যুক্ত হওয়ার পর নিয়মিত বুকিং পাচ্ছি। পেমেন্টও সময়মতো অ্যাকাউন্টে চলে আসে।",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "কীভাবে একটি সার্ভিস বুক করব?",
    a: "প্রথমে Services পেজ থেকে আপনার প্রয়োজনীয় ক্যাটাগরি বা সার্চ দিয়ে সার্ভিস খুঁজুন, তারপর পছন্দের সার্ভিসে ক্লিক করে তারিখ-সময় দিয়ে বুকিং কনফার্ম করুন। বুকিংয়ের জন্য লগইন থাকা প্রয়োজন।",
  },
  {
    q: "পেমেন্ট কখন করতে হয়?",
    a: "টেকনিশিয়ান আপনার বুকিং রিকোয়েস্ট গ্রহণ করার পর এবং কাজ শেষ হওয়ার পর SSLCommerz-এর মাধ্যমে নিরাপদে অনলাইন পেমেন্ট করতে পারবেন। ড্যাশবোর্ডের 'My Bookings' থেকে পেমেন্ট স্ট্যাটাস দেখা যায়।",
  },
  {
    q: "টেকনিশিয়ানরা কি যাচাইকৃত?",
    a: "হ্যাঁ, প্রতিটি টেকনিশিয়ান নিবন্ধনের সময় স্কিল ও পরিচয় সংক্রান্ত তথ্য যাচাইয়ের মধ্য দিয়ে যান। গ্রাহকরা প্রতিটি প্রোফাইলে রেটিং ও রিভিউ দেখেও সিদ্ধান্ত নিতে পারেন।",
  },
  {
    q: "বুকিং বাতিল করা যাবে কি?",
    a: "সার্ভিস শুরু হওয়ার আগ পর্যন্ত ড্যাশবোর্ড থেকে বুকিং বাতিল করা যায়। বারবার বাতিল এড়াতে নির্ধারিত সময়ের আগেই সিদ্ধান্ত নেওয়ার পরামর্শ দেওয়া হয়।",
  },
  {
    q: "কীভাবে টেকনিশিয়ান হিসেবে যুক্ত হব?",
    a: "Register পেজ থেকে 'Technician' হিসেবে অ্যাকাউন্ট খুলুন, আপনার স্কিল ও অভিজ্ঞতার তথ্য দিন এবং প্রোফাইল সম্পন্ন করুন। এরপর ড্যাশবোর্ড থেকে সার্ভিস যুক্ত করে বুকিং গ্রহণ শুরু করতে পারবেন।",
  },
  {
    q: "কোন এলাকায় সার্ভিস পাওয়া যায়?",
    a: "বর্তমানে ঢাকা শহরের বিভিন্ন এলাকায় সক্রিয় টেকনিশিয়ানরা সার্ভিস দিচ্ছেন। প্রতিটি সার্ভিস লিস্টিংয়ে নির্দিষ্ট লোকেশন উল্লেখ থাকে, বুকিংয়ের আগে তা দেখে নিন।",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // ============================================================
  // TanStack Query — এখন আর ম্যানুয়াল useState+useEffect+try/catch
  // লাগে না। ক্যাশিং, রিফেচ, রিভ্যালিডেশন, রেস-কন্ডিশন হ্যান্ডলিং —
  // সব হুক নিজে সামলায়। কোথাও নতুন service create/update/delete
  // হলে queryKeys.services.all invalidate হয় (দেখো
  // hooks/mutations/use-service-mutations.ts), তখন এই হোমপেজও
  // reload ছাড়াই নিজে থেকে আপডেট হয়ে যাবে।
  // ============================================================
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();

  const { data: servicesData, isLoading: loadingServices } = useServices({
    limit: 6,
  });
  const services = servicesData?.services ?? [];

  const { data: techniciansData, isLoading: loadingTechnicians } =
    useTechnicians({ limit: 4 });
  const technicians = techniciansData?.technicians ?? [];

  // ============================================================
  // Newsletter ফর্ম — client-side validation + loading + success state।
  // (এখনো কোনো newsletter API এন্ডপয়েন্ট নেই, তাই সাবমিট সিমুলেট করা
  // হয়েছে — backend রেডি হলে শুধু handleNewsletterSubmit-এর ভেতরে
  // আসল API কল বসিয়ে দিলেই হবে।)
  // ============================================================
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!trimmed) {
      setNewsletterError("ইমেইল অ্যাড্রেস দিতে হবে");
      return;
    }
    if (!isValidEmail) {
      setNewsletterError("সঠিক ইমেইল অ্যাড্রেস দিন");
      return;
    }

    setNewsletterError("");
    setNewsletterLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setNewsletterLoading(false);
    setNewsletterEmail("");
    toast.success("Subscribed! ধন্যবাদ, নতুন অফার আপডেট আপনার ইমেইলে যাবে।");
  };

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-6">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary border-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
            Your #1 Home Service Marketplace in Bangladesh
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Expert Home Services, <br className="hidden sm:inline" />
            <span className="text-primary">Just a Click Away.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Book verified plumbers, electricians, cleaners, and technicians for
            all your home repair and maintenance needs.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-2xl mx-auto pt-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services (e.g. AC Repair, Plumbing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 text-base rounded-lg border-muted-foreground/30 focus-visible:ring-primary"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 font-semibold text-base shadow-md"
            >
              Search
            </Button>
          </form>

          {/* CTAs & Quick Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified Technicians</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <span>Instant Slot Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Explore Categories
              </h2>
              <p className="text-sm text-muted-foreground">
                Find services by specialized categories
              </p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="text-primary gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingCategories ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <Link key={cat.id} href={`/services?categoryId=${cat.id}`}>
                  <Card className="hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer h-full text-center">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full space-y-2">
                      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-primary/10 ring-1 ring-primary/15">
                        <Image
                          src={getCategoryIconUrl(cat.icon || cat.name)}
                          alt={cat.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-sm line-clamp-1">
                        {cat.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-4">
                No categories available right now.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURED SERVICES ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Services
              </h2>
              <p className="text-muted-foreground">
                Top quality services booked by happy customers
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="gap-1">
                Explore All Services <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingServices ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                  </CardContent>
                </Card>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
                >
                  <div>
                    {/* Placeholder / Image Header */}
                    <div className="h-44 bg-gradient-to-r from-slate-800 to-slate-900 relative p-4 flex flex-col justify-between text-white">
                      <Badge className="w-max bg-primary text-primary-foreground">
                        {service.category?.name || "General"}
                      </Badge>
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                          By{" "}
                          {service.technician?.name || "Qualified Specialist"}
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description ||
                          "Professional service guaranteed with high satisfaction and quick setup."}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="h-4 w-4 fill-amber-500" />
                          <span>
                            {service.technician?.technicianProfile?.avgRating
                              ? service.technician.technicianProfile.avgRating.toFixed(
                                  1,
                                )
                              : "4.8"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {service.location || "Available nationwide"}
                        </span>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Starting from
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ৳{service.price}
                      </span>
                    </div>
                    <Link href={`/services/${service.id}`}>
                      <Button size="sm">Book Service</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No services listed yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= TOP TECHNICIANS ================= */}
      <section className="py-16 bg-muted/20 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Top-Rated Technicians
              </h2>
              <p className="text-muted-foreground">
                Hire skilled and background-checked specialists
              </p>
            </div>
            <Link href="/technicians">
              <Button variant="outline" className="gap-1">
                View All Technicians <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Technicians Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingTechnicians ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-5 space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                  <Skeleton className="h-5 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </Card>
              ))
            ) : technicians.length > 0 ? (
              technicians.map((tech) => (
                <Card
                  key={tech.id}
                  className="text-center p-6 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="relative h-20 w-20 mx-auto rounded-full overflow-hidden border-2 border-primary/20 bg-muted">
                      <Image
                        src={getAvatarUrl(tech.id || tech.name)}
                        alt={tech.name || "Technician"}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        {tech.name || "Technician"}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {tech.technicianProfile?.skills?.length
                          ? tech.technicianProfile.skills.join(", ")
                          : "General Specialist"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>
                          {tech.technicianProfile?.avgRating
                            ? tech.technicianProfile.avgRating.toFixed(1)
                            : "5.0"}
                        </span>
                      </div>
                      <div>•</div>
                      <div>
                        {tech.technicianProfile?.experienceYears || 2}+ Years
                        Exp
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t">
                    <Link href={`/technicians/${tech.id}`}>
                      <Button
                        variant="secondary"
                        className="w-full text-xs font-semibold"
                      >
                        View Profile & Book
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No technicians available at this moment.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 space-y-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Verified Experts</h3>
              <p className="text-sm text-muted-foreground">
                Every technician goes through background verification and skill
                tests.
              </p>
            </div>

            <div className="p-6 space-y-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Hassle-free Booking</h3>
              <p className="text-sm text-muted-foreground">
                Select your required service, pick a date-time slot, and track
                everything live.
              </p>
            </div>

            <div className="p-6 space-y-3 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">100% Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Pay via SSLCommerz after the technician accepts your booking
                request.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS (real dynamic counts) ================= */}
      <section className="py-14 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold">
                <Wrench className="h-7 w-7" />
                {loadingServices ? (
                  <Skeleton className="h-9 w-14 bg-primary-foreground/20" />
                ) : (
                  <span>{servicesData?.meta?.total ?? services.length}+</span>
                )}
              </div>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Services Listed
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold">
                <Users className="h-7 w-7" />
                {loadingTechnicians ? (
                  <Skeleton className="h-9 w-14 bg-primary-foreground/20" />
                ) : (
                  <span>
                    {techniciansData?.meta?.total ?? technicians.length}+
                  </span>
                )}
              </div>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Verified Technicians
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold">
                <FolderTree className="h-7 w-7" />
                {loadingCategories ? (
                  <Skeleton className="h-9 w-10 bg-primary-foreground/20" />
                ) : (
                  <span>{categories.length}+</span>
                )}
              </div>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Service Categories
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold">
                <Clock className="h-7 w-7" />
                <span>24/7</span>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Customer Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              গ্রাহকরা যা বলছেন
            </h2>
            <p className="text-muted-foreground mt-2">
              হাজারো সন্তুষ্ট গ্রাহক ও টেকনিশিয়ানের অভিজ্ঞতা
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="relative">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-7 w-7 text-primary/30" />
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="py-16 bg-muted/30 border-y scroll-mt-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্ন
            </h2>
            <p className="text-muted-foreground mt-2">
              FixItNow সম্পর্কে আরও জানতে নিচের প্রশ্নগুলো দেখুন
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="bg-background rounded-xl border px-4"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ================= NEWSLETTER + FINAL CTA ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold">
                নতুন অফার ও আপডেট পেতে সাবস্ক্রাইব করুন
              </h2>
              <p className="text-primary-foreground/85 text-sm md:text-base">
                সিজনাল ডিসকাউন্ট, নতুন সার্ভিস ক্যাটাগরি আর প্ল্যাটফর্ম আপডেট
                সবার আগে জানতে আপনার ইমেইল দিন।
              </p>
            </div>

            <div className="space-y-3">
              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-primary" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (newsletterError) setNewsletterError("");
                    }}
                    aria-label="Email address"
                    aria-invalid={!!newsletterError}
                    disabled={newsletterLoading}
                    className="pl-10 h-11 bg-background text-foreground border-0"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  variant="secondary"
                  disabled={newsletterLoading}
                  className="h-11 font-semibold gap-1.5 shrink-0"
                >
                  {newsletterLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Subscribe <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
              {newsletterError && (
                <p className="text-xs text-red-100 bg-red-600/40 rounded px-3 py-1.5 w-max">
                  {newsletterError}
                </p>
              )}

              <Link href="/services" className="inline-block pt-1">
                <Button
                  variant="link"
                  className="text-primary-foreground gap-1 px-0"
                >
                  অথবা এখনই সার্ভিস ব্রাউজ করুন{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
