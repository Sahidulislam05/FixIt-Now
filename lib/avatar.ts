// ============================================================
// ব্যাকএন্ডের কোনো entity-তেই (User/TechnicianProfile/Service) কোনো
// ছবির URL ফিল্ড নেই — অর্থাৎ প্রকৃত প্রোফাইল ছবি/সার্ভিস ছবি আপলোড করার
// কোনো ব্যবস্থাই ব্যাকএন্ডে নেই। তাই next/image দিয়ে "optimized images"
// দেখানোর জন্য DiceBear-এর ডিটারমিনিস্টিক অ্যাভাটার ব্যবহার করা হচ্ছে —
// একই নাম/আইডি সবসময় একই ছবি দেয় (random না), তাই UI স্থিতিশীল থাকে।
// ভবিষ্যতে ব্যাকএন্ডে সত্যিকারের profile photo ফিল্ড যোগ হলে এই ফাংশনটা
// সহজেই user.avatarUrl ব্যবহার করার জন্য বদলে ফেলা যাবে — বাকি অ্যাপের
// কোনো কম্পোনেন্ট বদলাতে হবে না, কারণ সবাই এই একটা হেল্পার দিয়েই ছবি পায়।
// ============================================================

const PALETTE = [
    "0ea5e9",
    "22c55e",
    "f59e0b",
    "ef4444",
    "8b5cf6",
    "ec4899",
    "14b8a6",
    "f97316",
    "6366f1",
    "06b6d4",
];

function hashSeed(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

/**
 * একজন ইউজার/টেকনিশিয়ানের নাম বা আইডি থেকে ডিটারমিনিস্টিক অ্যাভাটার URL।
 */
export function getAvatarUrl(seed: string, size = 128): string {
    const safeSeed = seed?.trim() || "FixItNow User";
    const color = PALETTE[hashSeed(safeSeed) % PALETTE.length];

    const params = new URLSearchParams({
        seed: safeSeed,
        size: String(size),
        backgroundColor: color,
        backgroundType: "solid",
        fontWeight: "600",
    });

    return `https://api.dicebear.com/9.x/initials/png?${params.toString()}`;
}

/**
 * ক্যাটাগরি কার্ডের জন্য ছোট, রঙিন abstract আইকন — কোনো নির্দিষ্ট
 * কপিরাইটেড ব্র্যান্ড আইকন ছাড়াই প্রতিটা ক্যাটাগরিকে ভিজুয়ালি আলাদা করে।
 */
export function getCategoryIconUrl(seed: string, size = 96): string {
    const safeSeed = seed?.trim() || "Service Category";
    const color = PALETTE[hashSeed(safeSeed) % PALETTE.length];

    const params = new URLSearchParams({
        seed: safeSeed,
        size: String(size),
        backgroundColor: color,
        backgroundType: "gradientLinear",
    });

    return `https://api.dicebear.com/9.x/icons/png?${params.toString()}`;
}
