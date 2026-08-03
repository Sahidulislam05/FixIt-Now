import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // DiceBear থেকে জেনারেট করা deterministic avatar ছবি next/image দিয়ে
    // অপ্টিমাইজ করার জন্য। ব্যাকএন্ডে ভবিষ্যতে সত্যিকারের profile-photo
    // আপলোড ফিচার (যেমন Cloudinary/S3) যোগ হলে সেই ডোমেইনও এখানে যোগ করো।
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;
