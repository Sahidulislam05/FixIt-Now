/**
 * The backend has no profile-photo field yet, so avatars are generated from the
 * user's name/id with DiceBear. The same seed always returns the same image, and
 * every component gets its avatar through this helper, so switching to real
 * uploads later only means changing this file.
 */

// Brand tones: signal orange, deep teal, mustard, ink.
const PALETTE = ["c2581f", "1f4a52", "d9a520", "2b2622", "8a4a2a", "3f6d72"];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarUrl(seed: string, size = 128): string {
  const safeSeed = seed?.trim() || "FixItNow User";
  const params = new URLSearchParams({
    seed: safeSeed,
    size: String(size),
    backgroundColor: PALETTE[hashSeed(safeSeed) % PALETTE.length],
    backgroundType: "solid",
    fontFamily: "Georgia",
    fontWeight: "600",
  });

  return `https://api.dicebear.com/9.x/initials/png?${params.toString()}`;
}
