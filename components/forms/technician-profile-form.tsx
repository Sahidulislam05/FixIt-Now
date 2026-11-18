"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormAlert } from "@/components/forms/form-alert";
import { updateMyTechnicianProfile } from "@/lib/api/technicians";
import { ApiError } from "@/lib/api/client";
import type { TechnicianProfile } from "@/lib/types";

const BIO_MAX = 1000;
const MAX_SKILLS = 12;

const schema = z.object({
  experienceYears: z
    .string()
    .min(1, "Enter your years of experience")
    .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Use a whole number")
    .refine((v) => Number(v) <= 60, "That seems too many years"),
  skills: z.array(z.string()).min(1, "Add at least one skill").max(MAX_SKILLS, `Up to ${MAX_SKILLS} skills`),
  bio: z
    .string()
    .trim()
    .min(40, "Write a few sentences (40+ characters) — customers read this before booking")
    .max(BIO_MAX, `Keep it under ${BIO_MAX} characters`),
});

type Values = z.infer<typeof schema>;

export function TechnicianProfileForm({ profile }: { profile?: TechnicianProfile | null }) {
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      experienceYears: String(profile?.experienceYears ?? 0),
      skills: profile?.skills ?? [],
      bio: profile?.bio ?? "",
    },
  });

  const bioLength = useWatch({ control: form.control, name: "bio" })?.length ?? 0;
  const { errors, isSubmitting, isDirty } = form.formState;

  function addSkill(skills: string[], onChange: (v: string[]) => void) {
    const value = draft.trim().replace(/,$/, "");
    if (!value) return;
    if (!skills.some((s) => s.toLowerCase() === value.toLowerCase()) && skills.length < MAX_SKILLS) {
      onChange([...skills, value]);
    }
    setDraft("");
  }

  async function onSubmit(values: Values) {
    setStatus(null);
    try {
      await updateMyTechnicianProfile({
        bio: values.bio,
        experienceYears: Number(values.experienceYears),
        skills: values.skills,
      });
      form.reset(values);
      setStatus({ tone: "success", message: "Your public profile is updated." });
      toast.success("Profile saved");
    } catch (error) {
      setStatus({
        tone: "error",
        message: error instanceof ApiError ? error.message : "Couldn't save your profile.",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-1.5 sm:max-w-[12rem]">
        <Label htmlFor="experience" className="text-[0.82rem] font-semibold">
          Years of experience
        </Label>
        <Input id="experience" type="number" inputMode="numeric" min={0} aria-invalid={!!errors.experienceYears} {...form.register("experienceYears")} />
        {errors.experienceYears && <p className="text-[0.8rem] text-destructive">{errors.experienceYears.message}</p>}
      </div>

      <Controller
        control={form.control}
        name="skills"
        render={({ field }) => (
          <div className="grid gap-1.5">
            <Label htmlFor="skill-input" className="text-[0.82rem] font-semibold">
              Skills
            </Label>
            <div
              className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40"
              aria-invalid={!!errors.skills}
            >
              <AnimatePresence initial={false}>
                {field.value.map((skill) => (
                  <motion.span
                    key={skill}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1 rounded-md bg-foreground py-1 pr-1 pl-2.5 text-sm text-background"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => field.onChange(field.value.filter((s) => s !== skill))}
                      className="rounded p-0.5 hover:bg-background/20"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="size-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <input
                id="skill-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addSkill(field.value, field.onChange);
                  } else if (e.key === "Backspace" && !draft && field.value.length) {
                    field.onChange(field.value.slice(0, -1));
                  }
                }}
                onBlur={() => {
                  addSkill(field.value, field.onChange);
                  field.onBlur();
                }}
                placeholder={field.value.length ? "Add another…" : "e.g. AC servicing — press Enter"}
                className="h-8 min-w-[10rem] flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground md:text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add. {field.value.length}/{MAX_SKILLS}
            </p>
            {errors.skills && <p className="text-[0.8rem] text-destructive">{errors.skills.message}</p>}
          </div>
        )}
      />

      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="bio" className="text-[0.82rem] font-semibold">
            About you
          </Label>
          <span className="font-mono text-xs text-muted-foreground">
            {bioLength}/{BIO_MAX}
          </span>
        </div>
        <Textarea
          id="bio"
          rows={5}
          placeholder="What kind of jobs you take, the areas you cover, anything customers should know."
          aria-invalid={!!errors.bio}
          {...form.register("bio")}
        />
        {errors.bio && <p className="text-[0.8rem] text-destructive">{errors.bio.message}</p>}
      </div>

      <FormAlert tone={status?.tone ?? "success"} message={status?.message} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Saving…" : "Save public profile"}
        </Button>
      </div>
    </form>
  );
}
