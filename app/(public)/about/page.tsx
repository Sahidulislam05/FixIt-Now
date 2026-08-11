import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Clock,
  Wrench,
  Target,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | FixItNow",
  description:
    "FixItNow একটি হোম সার্ভিস মার্কেটপ্লেস — যাচাইকৃত টেকনিশিয়ানদের সাথে বাড়ির যেকোনো সমস্যার সমাধান খুঁজে পান দ্রুত ও নিরাপদভাবে।",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    description:
      "প্রতিটি টেকনিশিয়ান রেজিস্ট্রেশনের সময় স্কিল ও পরিচয় যাচাইয়ের মধ্য দিয়ে যান, যাতে আপনি নিশ্চিন্তে বুকিং করতে পারেন।",
  },
  {
    icon: Target,
    title: "Transparent Pricing",
    description:
      "বুকিং করার আগেই সার্ভিসের মূল্য দেখতে পাবেন — কোনো লুকানো চার্জ বা শেষ মুহূর্তের দরকষাকষি নেই।",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description:
      "রিকোয়েস্ট পাঠানোর পর টেকনিশিয়ানরা দ্রুত রেসপন্স করেন, জরুরি প্রয়োজনে সময়মতো সাহায্য পান।",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description:
      "বুকিং থেকে পেমেন্ট পর্যন্ত পুরো প্রক্রিয়া সহজ ও স্বচ্ছ রাখাই আমাদের মূল লক্ষ্য।",
  },
];

const steps = [
  {
    step: "১",
    title: "সার্ভিস খুঁজুন",
    description:
      "ক্যাটাগরি বা সার্চ দিয়ে আপনার প্রয়োজনীয় সার্ভিস খুঁজে বের করুন।",
  },
  {
    step: "২",
    title: "টেকনিশিয়ান বেছে নিন",
    description:
      "রেটিং, অভিজ্ঞতা ও মূল্য দেখে পছন্দের টেকনিশিয়ান নির্বাচন করুন।",
  },
  {
    step: "৩",
    title: "বুক করুন",
    description: "সুবিধাজনক তারিখ-সময় দিয়ে বুকিং কনফার্ম করুন।",
  },
  {
    step: "৪",
    title: "কাজ শেষে পেমেন্ট",
    description:
      "টেকনিশিয়ান কাজ সম্পন্ন করার পর নিরাপদে অনলাইনে পেমেন্ট করুন।",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-20 border-b">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mx-auto">
            <Wrench className="h-7 w-7" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            আমরা বাড়ির সমস্যাকে সহজ সমাধানে বদলে দিই
          </h1>
          <p className="text-muted-foreground text-lg">
            FixItNow বাংলাদেশের একটি হোম সার্ভিস মার্কেটপ্লেস, যেখানে গ্রাহক ও
            যাচাইকৃত টেকনিশিয়ানরা এক প্ল্যাটফর্মে যুক্ত হন — প্লাম্বিং,
            ইলেকট্রিক্যাল, ক্লিনিং থেকে শুরু করে যেকোনো হোম রিপেয়ার সার্ভিসের
            জন্য।
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">আমাদের লক্ষ্য</h2>
          <p className="text-muted-foreground leading-relaxed">
            বাড়ির যেকোনো ছোটখাটো সমস্যায় নির্ভরযোগ্য টেকনিশিয়ান খুঁজে পাওয়া
            সবসময় সহজ ছিল না — পরিচিত কাউকে জিজ্ঞেস করা, দরদাম করা, তারপরও
            কাজের মান নিয়ে অনিশ্চয়তা। FixItNow এই পুরো অভিজ্ঞতাকে সহজ করে
            দিয়েছে: যাচাইকৃত টেকনিশিয়ান, স্বচ্ছ মূল্য, আর অনলাইনে নিরাপদ বুকিং
            ও পেমেন্ট — সব একই জায়গায়।
          </p>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            আমাদের মূল্যবোধ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="text-center">
                <CardContent className="p-6 space-y-3">
                  <div className="p-3 w-max rounded-full bg-primary/10 text-primary mx-auto">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            কীভাবে কাজ করে
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="relative p-6 rounded-2xl border">
                <span className="text-4xl font-extrabold text-primary/20">
                  {s.step}
                </span>
                <h3 className="font-semibold mt-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-5">
          <Users className="h-10 w-10 mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold">
            আজই আপনার প্রয়োজনীয় টেকনিশিয়ান খুঁজে নিন
          </h2>
          <Link href="/services">
            <Button size="lg" variant="secondary" className="gap-1.5">
              সার্ভিস দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
