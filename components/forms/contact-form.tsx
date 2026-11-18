"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormAlert } from "@/components/forms/form-alert";
import { sendContactMessage } from "@/lib/api/contact";
import { ApiError } from "@/lib/api/client";

const MESSAGE_MAX = 2000;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please enter a valid email address"),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(160),
  message: z
    .string()
    .trim()
    .min(20, "Please give us a little more detail (20+ characters)")
    .max(MESSAGE_MAX, `Keep it under ${MESSAGE_MAX} characters`),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const messageLength = useWatch({ control: form.control, name: "message" })?.length ?? 0;

  async function onSubmit(values: ContactFormValues) {
    setServerError(null);
    try {
      await sendContactMessage(values);
      toast.success("Message sent.");
      setSentTo(values.email);
      form.reset();
    } catch (error) {
      if (error instanceof ApiError && error.issues?.length) {
        for (const issue of error.issues) {
          const field = issue.path.replace(/^body\./, "") as keyof ContactFormValues;
          if (field in values) form.setError(field, { message: issue.message });
        }
      }
      setServerError(
        error instanceof ApiError ? error.message : "We couldn't send your message. Please try again.",
      );
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sentTo ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-start gap-4 py-6"
          role="status"
        >
          <motion.span
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className="grid size-14 place-items-center rounded-full bg-success text-success-foreground"
          >
            <CheckCircle2 className="size-7" />
          </motion.span>
          <h3 className="text-2xl font-semibold">Thanks — we&apos;ve got it.</h3>
          <p className="text-muted-foreground">
            Someone from our support team will reply to <strong className="text-foreground">{sentTo}</strong>{" "}
            within one working day.
          </p>
          <Button variant="outline" onClick={() => setSentTo(null)}>
            Send another message
          </Button>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your name</FormLabel>
                      <FormControl>
                        <Input placeholder="Rahim Uddin" autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Question about a booking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-baseline justify-between">
                      <FormLabel>Message</FormLabel>
                      <span
                        className={`font-mono text-xs ${messageLength > MESSAGE_MAX ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        {messageLength}/{MESSAGE_MAX}
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Tell us what happened. If it's about a booking, the service name and date help."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormAlert tone="error" message={serverError} />

              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <ArrowRight />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
