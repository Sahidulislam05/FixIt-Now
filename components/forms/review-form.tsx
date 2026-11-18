"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormAlert } from "@/components/forms/form-alert";
import { cn } from "@/lib/utils";

const LABELS = ["", "Poor", "Below average", "Okay", "Good", "Excellent"];
const COMMENT_MIN = 10;
const COMMENT_MAX = 1000;

interface ReviewFormProps {
  pending: boolean;
  serverError?: string | null;
  onSubmit: (values: { rating: number; comment: string }) => void;
  onCancel: () => void;
}

export function ReviewForm({ pending, serverError, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = comment.trim();
  const ratingError = touched && rating === 0 ? "Pick a star rating" : null;
  const commentError =
    touched && trimmed.length < COMMENT_MIN
      ? `Write at least ${COMMENT_MIN} characters`
      : trimmed.length > COMMENT_MAX
        ? `Keep it under ${COMMENT_MAX} characters`
        : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (rating === 0 || trimmed.length < COMMENT_MIN || trimmed.length > COMMENT_MAX) return;
    onSubmit({ rating, comment: trimmed });
  }

  const shown = hover || rating;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-[0.82rem] font-semibold">Your rating</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.15, rotate: -8 }}
              onMouseEnter={() => setHover(star)}
              onClick={() => setRating(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              aria-pressed={rating === star}
              className="rounded-md p-1"
            >
              <Star
                className={cn(
                  "size-8 transition-colors",
                  star <= shown ? "fill-highlight text-highlight" : "text-muted-foreground/30",
                )}
              />
            </motion.button>
          ))}
          <span className="ml-3 font-mono text-sm text-muted-foreground" aria-live="polite">
            {LABELS[shown]}
          </span>
        </div>
        {ratingError && <p className="mt-1 text-[0.8rem] text-destructive">{ratingError}</p>}
      </fieldset>

      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="review-comment" className="text-[0.82rem] font-semibold">
            What was it like?
          </Label>
          <span className="font-mono text-xs text-muted-foreground">
            {trimmed.length}/{COMMENT_MAX}
          </span>
        </div>
        <Textarea
          id="review-comment"
          rows={4}
          placeholder="Was the technician on time? Was the work done properly?"
          value={comment}
          aria-invalid={!!commentError}
          onChange={(e) => setComment(e.target.value)}
          onBlur={() => trimmed && setTouched(true)}
        />
        {commentError && <p className="text-[0.8rem] text-destructive">{commentError}</p>}
      </div>

      <FormAlert tone="error" message={serverError} />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {pending ? "Posting…" : "Post review"}
        </Button>
      </div>
    </form>
  );
}
